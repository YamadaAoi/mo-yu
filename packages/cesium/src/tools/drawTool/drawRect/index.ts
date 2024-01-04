/*
 * @Author: zhouyinkui
 * @Date: 2024-01-04 14:37:54
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-04 16:58:28
 * @Description: 画矩形
 */
import { Cartesian3, Cartographic } from 'cesium'
import { DrawPolygonTool, DrawPolygonToolOptions } from '../drawPolygon'
import { DrawBaseEvents } from '../drawBase'
import { getPosiOnMap } from '../../../utils/getPosi'

/**
 * 画矩形功能入参
 */
export interface DrawRectToolOptions extends DrawPolygonToolOptions {}

/**
 * 画矩形事件
 */
export interface DrawRectToolEvents extends DrawBaseEvents {
  'left-click': {
    rects: Cartesian3[][]
    point: Cartesian3
  }
  'mouse-move': {
    rects: Cartesian3[][]
    point: Cartesian3
  }
  'right-click': {
    rects: Cartesian3[][]
  }
  'left-dbclick': {
    rects: Cartesian3[][]
  }
}

/**
 * 绘制矩形
 * @example
 * ```ts
 * const tool = new DrawRectTool(options)
 *
 * tool.enable()
 *
 * tool.eventBus.on('left-click', onLeftClick)
 * tool.eventBus.on('mouse-move', onMouseMove)
 * tool.eventBus.on('right-click', onRightClick)
 * tool.eventBus.on('left-dbclick', onLeftDBClick)
 * ```
 */
export class DrawRectTool extends DrawPolygonTool<
  DrawRectToolOptions,
  DrawRectToolEvents
> {
  constructor(options: DrawRectToolOptions) {
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
      rects: this.areas.concat(),
      point
    })
  }

  protected onMouseMove = (point: Cartesian3) => {
    const points = this.points.concat()
    if (point && points.length === 1) {
      if (!this.floatLine) {
        this.floatLine = this.createLFloatLine()
      }
      this.#getRectPoints(points[0], point)
        .then(ps => {
          if (ps?.length === 4) {
            this.floatLinePoints = [...ps, ps[0]]
            this.floatAreaPoints = ps
            if (!this.floatArea) {
              this.floatArea = this.createLFloatArea()
            }
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
    this.eventBus.fire('mouse-move', {
      rects: this.areas.concat(),
      point
    })
  }

  protected onRightClick = () => {
    this.validateArea()
    this.floatLinePoints = []
    this.floatAreaPoints = []
    this.eventBus.fire('right-click', { rects: this.areas.concat() })
  }

  protected onLeftDBClick = () => {
    this.validateArea()
    this.clearFloat()
    this.eventBus.fire('left-dbclick', { rects: this.areas.concat() })
  }

  /**
   * 校验矩形
   */
  protected validateArea() {
    const points = this.points.concat()
    if (points.length === 2) {
      this.#getRectPoints(points[0], points[1])
        .then(ps => {
          if (ps?.length === 4) {
            this.areas.push(ps)
            this.createArea(ps)
            this.createLine([...ps, ps[0]])
          }
        })
        .catch(err => {
          console.error(err)
        })
    } else if (points.length === 1) {
      const len = this.pointCollection.length
      const lastPoint = this.pointCollection.get(len - 1)
      this.pointCollection.remove(lastPoint)
    }
    this.points = []
  }

  /**
   * 重写绘制矩形鼠标左击事件
   * @param point - 点
   */
  protected handleLineLeftClick(point: Cartesian3) {
    const points = this.points.concat()
    if (points.length === 1) {
      if (this.curLine) {
        this.polyCollection?.remove(this.curLine)
        this.curLine = undefined
      }
      this.floatLinePoints = [point, point, point, point, point]
    } else if (points.length === 2) {
      this.validateArea()
      this.floatLinePoints = []
      this.floatAreaPoints = []
    }
  }

  /**
   * p1---p4
   *  |   |
   * p2---p3
   * @param p1 - 矩形对角
   * @param p3 - 矩形对角
   * @returns
   */
  async #getRectPoints(p1: Cartesian3, p3: Cartesian3) {
    const c1 = Cartographic.fromCartesian(p1)
    const c3 = Cartographic.fromCartesian(p3)
    const p2 = await getPosiOnMap(
      Cartesian3.fromRadians(c1.longitude, c3.latitude, c1.height)
    )
    const p4 = await getPosiOnMap(
      Cartesian3.fromRadians(c3.longitude, c1.latitude, c1.height)
    )
    return [p1, p2, p3, p4]
  }
}
