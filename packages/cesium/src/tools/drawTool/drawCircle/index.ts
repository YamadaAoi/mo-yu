/*
 * @Author: zhouyinkui
 * @Date: 2024-01-04 17:37:40
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-04 19:07:58
 * @Description: 画圆
 */
import { CallbackProperty, Cartesian3, Color, EllipseGraphics } from 'cesium'
import { getDefault } from '@mo-yu/core'
import { DrawRectTool, DrawRectToolOptions } from '../drawRect'
import { DrawBaseEvents } from '../drawBase'
import { getHorizontalDistance } from '../../../utils/calc'
import { CircleOption, createCircle } from '../../../core/geo/circle'

/**
 * 画矩形功能入参
 */
export interface DrawCircleToolOptions extends DrawRectToolOptions {
  /**
   * 面样式
   */
  circle?: CircleOption
  /**
   * 拖拽面样式
   */
  floatCircle?: EllipseGraphics.ConstructorOptions
}

/**
 * 圆心、半径确定圆
 */
export interface CircleParam {
  center: Cartesian3
  radius: number
}

/**
 * 画矩形事件
 */
export interface DrawCircleToolEvents extends DrawBaseEvents {
  'left-click': {
    circles: CircleParam[]
    point: Cartesian3
  }
  'mouse-move': {
    circles: CircleParam[]
    point: Cartesian3
  }
  'right-click': {
    circles: CircleParam[]
  }
  'left-dbclick': {
    circles: CircleParam[]
  }
}

/**
 * 绘制矩形
 * @example
 * ```ts
 * const tool = new DrawCircleTool(options)
 *
 * tool.enable()
 *
 * tool.eventBus.on('left-click', onLeftClick)
 * tool.eventBus.on('mouse-move', onMouseMove)
 * tool.eventBus.on('right-click', onRightClick)
 * tool.eventBus.on('left-dbclick', onLeftDBClick)
 * ```
 */
export class DrawCircleTool extends DrawRectTool<
  DrawCircleToolOptions,
  DrawCircleToolEvents
> {
  #circles: CircleParam[] = []
  #floatCircleCenter = Cartesian3.ZERO
  #radius = 0
  constructor(options: DrawCircleToolOptions) {
    super(options)
  }

  /**
   * 启用
   */
  enable(): void {
    super.enable()
  }

  /**
   * 销毁
   */
  destroy(): void {
    super.destroy()
  }

  /**
   * {@inheritDoc DrawBase.stop}
   * @override
   */
  stop(): void {
    super.stop()
  }

  /**
   * {@inheritDoc DrawBase.clear}
   * @override
   */
  clear(): void {
    super.clear()
  }

  protected onLeftClick = (point: Cartesian3) => {
    this.handleLineLeftClick(point)
    this.eventBus.fire('left-click', {
      circles: this.#circles.concat(),
      point
    })
  }

  protected onMouseMove = (point: Cartesian3) => {
    const points = this.points.concat()
    if (point && points.length === 1) {
      if (!this.floatLine) {
        this.floatLine = this.createLFloatLine()
      }
      this.floatLinePoints = [points[0], point]
      this.#radius = getHorizontalDistance(points[0], point)
      this.#floatCircleCenter = points[0].clone()
      if (!this.floatArea) {
        this.floatArea = this.createLFloatArea()
      }
    }
    this.eventBus.fire('mouse-move', {
      circles: this.#circles.concat(),
      point
    })
  }

  protected onRightClick = () => {
    this.validateArea()
    this.floatLinePoints = []
    this.clearFloat()
    this.eventBus.fire('right-click', { circles: this.#circles.concat() })
  }

  protected onLeftDBClick = () => {
    this.validateArea()
    this.clearFloat()
    this.eventBus.fire('left-dbclick', { circles: this.#circles.concat() })
  }

  /**
   * 创建拖拽圆
   * @returns
   */
  protected createLFloatArea() {
    const area = this.viewer?.entities.add({
      position: this.#floatCircleCenter,
      ellipse: getDefault(
        {
          semiMajorAxis: new CallbackProperty(() => {
            return this.#radius
          }, false),
          semiMinorAxis: new CallbackProperty(() => {
            return this.#radius
          }, false),
          material:
            this.options.polygon?.material instanceof Color
              ? this.options.polygon.material.withAlpha(0.5)
              : Color.BLUE.withAlpha(0.5)
        },
        this.options.floatCircle
      )
    })
    return area
  }

  /**
   * 校验圆
   */
  protected validateArea() {
    const points = this.points.concat()
    if (points.length === 2) {
      const radius = getHorizontalDistance(points[0], points[1])
      this.#circles.push({
        center: points[0],
        radius
      })
      this.#createCircle(points[0], radius)
    } else if (points.length === 1) {
      const len = this.pointCollection.length
      const lastPoint = this.pointCollection.get(len - 1)
      this.pointCollection.remove(lastPoint)
    }
    this.points = []
  }

  /**
   * 重写绘制圆鼠标左击事件
   * @param point - 点
   */
  protected handleLineLeftClick(point: Cartesian3) {
    const points = this.points.concat()
    if (points.length === 1) {
      this.floatLinePoints = [point, point]
    } else if (points.length === 2) {
      this.validateArea()
      this.floatLinePoints = []
      this.clearFloat()
    }
  }

  /**
   * 创建圆
   * @param center - 圆心
   * @param radius - 半径
   * @returns
   */
  #createCircle(center: Cartesian3, radius: number) {
    const area = this.polyCollection?.add(
      createCircle(
        getDefault(
          {
            center,
            radius
          },
          this.options.circle
        )
      )
    )
    return area
  }
}
