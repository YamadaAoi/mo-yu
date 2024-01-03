/*
 * @Author: zhouyinkui
 * @Date: 2024-01-03 17:17:55
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-03 18:39:00
 * @Description: 画多边形
 */
import {
  CallbackProperty,
  Cartesian3,
  Color,
  Entity,
  PolylineDashMaterialProperty,
  PolylineGraphics,
  PrimitiveCollection,
  PolygonGraphics,
  PolygonHierarchy
} from 'cesium'
import { getDefault } from '@mo-yu/core'
import { createPolyline } from '../../../core/geo/polyline'
import { createPolygon, PolygonOption } from '../../../core/geo/polygon'
import { DrawPointTool } from '../drawPoint'
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
export class DrawPolygonTool extends DrawPointTool<
  DrawPolygonToolOptions,
  DrawPolygonToolEvents
> {
  /**
   * 绘制中的线实体
   */
  #curLine: any | undefined
  /**
   * 移动的线的点
   */
  #floatLinePoints: Cartesian3[] = []
  /**
   * 移动的线实体
   */
  #floatLine: Entity | undefined
  /**
   * 绘制完成的线、面实体集合
   */
  #polyCollection: PrimitiveCollection
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
  constructor(options: DrawPolylineToolOptions) {
    super(options)
    this.#polyCollection = this.viewer?.scene.primitives.add(
      new PrimitiveCollection()
    )
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
    this.viewer?.scene.primitives.remove(this.#polyCollection)
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
    this.#clearFloat()
    this.#polyCollection?.removeAll()
  }

  onLeftClick = (point: Cartesian3) => {
    this.#floatLinePoints = [point, point]
    const points = this.points.concat()
    if (points.length > 1) {
      const prevLine = this.#curLine
      this.#curLine = this.#createLine(points)
      if (prevLine) {
        this.#polyCollection?.remove(prevLine)
      }
    }
    this.eventBus.fire('left-click', {
      polygons: this.#areas.concat(),
      point
    })
  }

  onMouseMove = (point: Cartesian3) => {
    const points = this.points.concat()
    if (point && points.length > 0) {
      if (!this.#floatLine) {
        this.#floatLine = this.#createLFloatLine()
      }
      this.#floatLinePoints = [points[0], point, points[points.length - 1]]
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

  onRightClick = () => {
    this.#validateArea()
    this.#floatLinePoints = []
    this.#floatAreaPoints = []
    this.eventBus.fire('right-click', { polygons: this.#areas.concat() })
  }

  onLeftDBClick = () => {
    this.#validateArea()
    this.#clearFloat()
    this.eventBus.fire('left-dbclick', { polygons: this.#areas.concat() })
  }

  /**
   * 创建线
   * @param positions - 点
   * @returns
   */
  #createLine(positions: Cartesian3[]) {
    const line = this.#polyCollection?.add(
      createPolyline(
        getDefault(
          {
            positions
          },
          this.options.polyline
        )
      )
    )
    return line
  }

  /**
   * 创建面
   * @param positions - 点
   * @returns
   */
  #createArea(positions: Cartesian3[]) {
    const area = this.#polyCollection?.add(
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
   * 创建拖拽线
   * @returns
   */
  #createLFloatLine() {
    const line = this.viewer?.entities.add({
      polyline: getDefault(
        {
          // 与depthFailMaterial不兼容
          positions: new CallbackProperty(() => {
            return this.#floatLinePoints
          }, false),
          width: 2,
          material: new PolylineDashMaterialProperty({
            color:
              this.options.polyline?.material instanceof Color
                ? this.options.polyline?.material
                : Color.BLUE
          })
        },
        this.options.floatPolyline
      )
    })
    return line
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
      this.#createLine(lastLine)
    } else {
      if (this.#curLine) {
        this.#polyCollection.remove(this.#curLine)
        this.#curLine = undefined
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

  #clearFloat() {
    this.#floatLinePoints = []
    if (this.#floatLine) {
      this.viewer?.entities.remove(this.#floatLine)
    }
    this.#floatLine = undefined
    this.#floatAreaPoints = []
    if (this.#floatArea) {
      this.viewer?.entities.remove(this.#floatArea)
    }
    this.#floatArea = undefined
  }
}
