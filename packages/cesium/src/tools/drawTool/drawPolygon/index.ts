/*
 * @Author: zhouyinkui
 * @Date: 2024-01-03 17:17:55
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-04 10:33:49
 * @Description: 画多边形
 */
import {
  CallbackProperty,
  Cartesian3,
  Color,
  Entity,
  PolygonGraphics,
  PolygonHierarchy
} from 'cesium'
import { getDefault } from '@mo-yu/core'
import { createPolygon, PolygonOption } from '../../../core/geo/polygon'
import { DrawPolylineTool } from '../drawPolyline'
import { DrawPolylineToolOptions } from '../drawPolyline'
import { DrawBaseEvents } from '../drawBase'

/**
 * 画线功能入参
 */
export interface DrawPolygonToolOptions extends DrawPolylineToolOptions {
  /**
   * 面样式
   */
  polygon?: PolygonOption
  /**
   * 拖拽面样式
   */
  floatPolygon?: PolygonGraphics.ConstructorOptions
}

/**
 * 画线事件
 */
export interface DrawPolygonToolEvents extends DrawBaseEvents {
  'left-click': {
    polygons: Cartesian3[][]
    point: Cartesian3
  }
  'mouse-move': {
    polygons: Cartesian3[][]
    point: Cartesian3
  }
  'right-click': {
    polygons: Cartesian3[][]
  }
  'left-dbclick': {
    polygons: Cartesian3[][]
  }
}

/**
 * 绘制多边形
 * @example
 * ```ts
 * const tool = new DrawPolygonTool(options)
 *
 * tool.enable()
 *
 * tool.eventBus.on('left-click', onLeftClick)
 * tool.eventBus.on('mouse-move', onMouseMove)
 * tool.eventBus.on('right-click', onRightClick)
 * tool.eventBus.on('left-dbclick', onLeftDBClick)
 * ```
 */
export class DrawPolygonTool extends DrawPolylineTool<
  DrawPolygonToolOptions,
  DrawPolygonToolEvents
> {
  /**
   * 绘制完成的面的点
   */
  #areas: Cartesian3[][] = []
  /**
   * 移动的面的点
   */
  #floatAreaPoints: Cartesian3[] = []
  /**
   * 移动的面实体
   */
  #floatArea: Entity | undefined
  constructor(options: DrawPolygonToolOptions) {
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
    this.clearFloat()
    this.#areas = []
  }

  protected onLeftClick = (point: Cartesian3) => {
    this.handleLineLeftClick(point)
    this.eventBus.fire('left-click', {
      polygons: this.#areas.concat(),
      point
    })
  }

  protected onMouseMove = (point: Cartesian3) => {
    const points = this.points.concat()
    if (point && points.length > 0) {
      if (!this.floatLine) {
        this.floatLine = this.createLFloatLine()
      }
      this.floatLinePoints =
        points.length > 1
          ? [points[0], point, points[points.length - 1]]
          : [points[0], point]
      if (points.length > 1) {
        if (!this.#floatArea) {
          this.#floatArea = this.#createLFloatArea()
        }
        this.#floatAreaPoints = [...points, point]
      }
    }
    this.eventBus.fire('mouse-move', {
      polygons: this.#areas.concat(),
      point
    })
  }

  protected onRightClick = () => {
    this.#validateArea()
    this.floatLinePoints = []
    this.#floatAreaPoints = []
    this.eventBus.fire('right-click', { polygons: this.#areas.concat() })
  }

  protected onLeftDBClick = () => {
    this.#validateArea()
    this.clearFloat()
    this.eventBus.fire('left-dbclick', { polygons: this.#areas.concat() })
  }

  /**
   * 清除浮动实体
   */
  protected clearFloat() {
    super.clearFloat()
    this.#floatAreaPoints = []
    if (this.#floatArea) {
      this.viewer?.entities.remove(this.#floatArea)
    }
    this.#floatArea = undefined
  }

  /**
   * 创建面
   * @param positions - 点
   * @returns
   */
  #createArea(positions: Cartesian3[]) {
    const area = this.polyCollection?.add(
      createPolygon(
        getDefault(
          {
            positions
          },
          this.options.polygon
        )
      )
    )
    return area
  }

  /**
   * 创建拖拽面
   * @returns
   */
  #createLFloatArea() {
    const area = this.viewer?.entities.add({
      polygon: getDefault(
        {
          hierarchy: new CallbackProperty(() => {
            return new PolygonHierarchy(this.#floatAreaPoints)
          }, false),
          material:
            this.options.polygon?.material instanceof Color
              ? this.options.polygon.material.withAlpha(0.7)
              : Color.BLUE.withAlpha(0.7),
          perPositionHeight: true
        },
        this.options.floatPolygon
      )
    })
    return area
  }

  #validateArea() {
    const points = this.points.concat()
    if (points.length > 2) {
      this.#areas.push(points)
      this.#createArea(points)
      const lastLine = [points[0], points[points.length - 1]]
      this.createLine(lastLine)
    } else {
      if (this.curLine) {
        this.polyCollection.remove(this.curLine)
        this.curLine = undefined
      }
      if (points.length > 0) {
        const len = this.pointCollection.length
        const indexs = new Array(points.length).fill('').map((s, i) => {
          return len - 1 - i
        })
        indexs.forEach(i => {
          const p = this.pointCollection.get(i)
          this.pointCollection.remove(p)
        })
      }
    }
    this.points = []
  }
}
