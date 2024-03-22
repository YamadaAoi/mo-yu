/*
 * @Author: zhouyinkui
 * @Date: 2024-03-20 16:34:47
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-21 14:42:27
 * @Description: 飞行工具
 */
import {
  Cartesian3,
  Clock,
  ClockRange,
  ClockStep,
  JulianDate,
  LagrangePolynomialApproximation,
  Math as CesiumMath,
  SampledPositionProperty,
  SampledProperty
} from 'cesium'
import { ToolBase, ToolBaseOptions, isNull } from '@mo-yu/core'
import { mapStoreTool } from '../storeTool'
import { Rotation } from '../cameraTool'
import { Position } from '../../mapViewAble'

/**
 * 相机位置和飞行控制参数
 */
export type FlyInfo = Required<Position> &
  Required<Rotation> & {
    /**
     * 飞行耗时， 默认1
     */
    duration?: number
  }

/**
 * 飞行参数
 */
export interface FlyConfig {
  route: FlyInfo[]
  handleHeading?: boolean
}

/**
 * 飞行事件
 */
export interface MapFlyToolEvents {
  /**
   * 当前飞行时间点
   */
  'time-change': {
    /**
     * 发送当前飞行秒数
     */
    sceonds: number
  }
  /**
   * 飞行播放状态变化
   */
  'flying-change': {
    /**
     * 发送当前飞行状态
     */
    flying: boolean
  }
}

interface FlyOption {
  start: JulianDate
  stop: JulianDate
  total: number
  position: SampledPositionProperty
  heading: SampledProperty
  pitch: SampledProperty
  // roll: SampledProperty
}

/**
 * 飞行实现类
 * @example
 * ```ts
 * const tool = new MapFlyTool({})
 * tool.enable()
 * tool.eventBus.on('time-change', e => {
 *   console.log(e)
 * })
 * tool.eventBus.on('flying-change', e => {
 *   console.log(e)
 * })
 *
 * tool.initRoute([...])
 *
 * const seconds = tool.getFlyDuration()
 * tool.play()
 * // tool.stop()
 *
 * tool.setView(value)
 *
 * tool.destroy()
 * ```
 */
export class MapFlyTool extends ToolBase<ToolBaseOptions, MapFlyToolEvents> {
  #route: FlyInfo[] = []
  #flying = false
  #flyOption: FlyOption | undefined
  #index = 0
  #clock = new Clock({
    clockRange: ClockRange.CLAMPED,
    multiplier: 0.02,
    clockStep: ClockStep.TICK_DEPENDENT
  })
  constructor(options: ToolBaseOptions) {
    super(options)
  }

  /**
   * 启用
   */
  enable(): void {
    this.#clock.onTick.addEventListener(this.#onTick)
    if (this.#viewer) {
      this.#viewer.clock.onTick.addEventListener(this.#onOriginTick)
    }
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.#clock.onTick.removeEventListener(this.#onTick)
    if (this.#viewer) {
      this.#viewer.clock.onTick.removeEventListener(this.#onOriginTick)
    }
    this.clear()
  }

  /**
   * 清空当前飞行场景
   */
  clear() {
    this.stop()
    this.#route = []
    this.#flyOption = undefined
  }

  /**
   * 飞行中止
   */
  stop() {
    this.#flyingChange(false)
    this.#clock.shouldAnimate = false
  }

  /**
   * 初始化飞行路线
   * @param route - 飞行路线
   * @param handleHeading - 是否开启优化相机角度（Heading），不开启则使用原始数据插值
   */
  initRoute(route: FlyInfo[], handleHeading = true) {
    this.clear()
    this.#route = this.#optimizeHeading(route, handleHeading)
    this.#initFly()
  }

  /**
   * 开始飞行
   */
  play() {
    if (!this.#flying && this.#flyOption) {
      if (
        JulianDate.greaterThanOrEquals(
          this.#clock.currentTime,
          this.#flyOption.stop
        )
      ) {
        this.#clock.currentTime = this.#flyOption.start.clone()
      }
      this.#flyingChange(true)
      this.#clock.shouldAnimate = true
    }
  }

  /**
   * 定位到提供秒数的飞行位置
   * @param sceonds - 秒数
   */
  setView(sceonds: number) {
    this.stop()
    this.#flyingChange(false)
    if (this.#flyOption) {
      const targetTime = JulianDate.addSeconds(
        this.#flyOption.start,
        sceonds,
        new JulianDate()
      )
      this.#clock.currentTime = targetTime
      this.#moveCamera(targetTime)
      this.eventBus.fire('time-change', { sceonds })
    }
  }

  /**
   * 获取当前飞行场景总时长（秒）
   * @returns
   */
  getFlyDuration() {
    return this.#flyOption?.total ?? 0
  }

  #initFly() {
    if (this.#route?.length) {
      const position = new SampledPositionProperty()
      const heading = new SampledProperty(Number)
      const pitch = new SampledProperty(Number)
      const start = JulianDate.fromDate(new Date())
      let stop = start
      let total = 0
      this.#route.forEach((r, i) => {
        let duration = 0
        if (i > 0) {
          duration = (isNull(r.duration) ? 1 : r.duration) as number
        }
        total += duration
        stop = JulianDate.addSeconds(start, total, new JulianDate())
        const point = Cartesian3.fromDegrees(
          Number(r.lng),
          Number(r.lat),
          Number(r.height)
        )
        position.addSample(stop, point)
        heading.addSample(stop, Number(r.heading))
        pitch.addSample(stop, Number(r.pitch))
      })
      position.setInterpolationOptions({
        interpolationDegree: 5,
        interpolationAlgorithm: LagrangePolynomialApproximation
      })
      heading.setInterpolationOptions({
        interpolationDegree: 5,
        interpolationAlgorithm: LagrangePolynomialApproximation
      })
      pitch.setInterpolationOptions({
        interpolationDegree: 5,
        interpolationAlgorithm: LagrangePolynomialApproximation
      })
      this.#clock.startTime = start.clone()
      this.#clock.stopTime = stop.clone()
      this.#clock.currentTime = start.clone()
      this.#flyOption = {
        start,
        stop,
        total,
        position,
        heading,
        pitch
      }
    }
  }

  #flyingChange(status: boolean) {
    this.#flying = status
    this.eventBus.fire('flying-change', {
      flying: status
    })
  }

  #moveCamera(currentTime: JulianDate) {
    if (this.#viewer && this.#flyOption) {
      this.#viewer.camera.setView({
        destination: this.#flyOption.position.getValue(currentTime),
        orientation: {
          heading: CesiumMath.toRadians(
            this.#flyOption.heading.getValue(currentTime)
          ),
          pitch: CesiumMath.toRadians(
            this.#flyOption.pitch.getValue(currentTime)
          )
        }
      })
    }
  }

  #timeChange(currentTime: JulianDate) {
    if (this.#flyOption?.start) {
      const sceonds = Math.ceil(
        currentTime.secondsOfDay - this.#flyOption.start.secondsOfDay
      )
      if (sceonds !== this.#index) {
        this.#index = sceonds
        this.eventBus.fire('time-change', { sceonds })
      }
    }
  }

  #optimizeHeading(route: FlyInfo[], handleHeading: boolean) {
    let points: FlyInfo[] = (route ?? []).concat()
    const len = points.length
    if (handleHeading && len > 1) {
      const angles: number[] = new Array(len)
      points = points.map((p, i) => {
        if (i === 0) {
          const heading = p.heading ?? 0
          angles[i] = heading
          return { ...p, heading }
        } else {
          // 前一点角度
          const prev = angles[i - 1]
          // 当前点角度
          const cur = isNull(p.heading) ? prev : p.heading
          // 前后角度差
          const diff = (cur - prev) % 360
          let heading: number
          if (Math.abs(diff) <= 180) {
            // 前一角度+最小角度差
            heading = prev + diff
          } else {
            // 最小角度差
            const minDiff = 360 - Math.abs(diff)
            if (diff > 0) {
              heading = prev - minDiff
            } else {
              heading = prev + minDiff
            }
          }
          angles[i] = heading
          return { ...p, heading }
        }
      })
    }
    return points
  }

  #onTick = (clock: Clock) => {
    if (this.#flyOption?.stop) {
      if (
        JulianDate.greaterThanOrEquals(clock.currentTime, this.#flyOption.stop)
      ) {
        this.stop()
        this.#clock.currentTime = this.#flyOption.stop.clone()
      } else {
        this.#moveCamera(clock.currentTime)
        this.#timeChange(clock.currentTime)
      }
    }
  }

  #onOriginTick = () => {
    if (this.#clock.shouldAnimate) {
      this.#clock.tick()
    }
  }

  get #viewer() {
    return mapStoreTool.getMap()?.viewer
  }
}
