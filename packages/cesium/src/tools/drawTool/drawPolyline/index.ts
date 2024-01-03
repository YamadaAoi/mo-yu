/*
 * @Author: zhouyinkui
 * @Date: 2024-01-02 17:54:31
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-03 18:38:09
 * @Description: 画线
 */
import {
  CallbackProperty,
  Cartesian3,
  Color,
  Entity,
  PolylineDashMaterialProperty,
  PolylineGraphics,
  PrimitiveCollection
} from 'cesium'
import { getDefault } from '@mo-yu/core'
import { createPolyline, PolylineOption } from '../../../core/geo/polyline'
import { DrawPointTool, DrawPointToolOptions } from '../drawPoint'
import { DrawBaseEvents } from '../drawBase'

/**
 * 画线功能入参
 */
export interface DrawPolylineToolOptions extends DrawPointToolOptions {
  /**
   * 线样式
   */
  polyline?: PolylineOption
  /**
   * 拖拽线样式
   */
  floatPolyline?: PolylineGraphics.ConstructorOptions
}

/**
 * 画线事件
 */
export interface DrawPolylineToolEvents extends DrawBaseEvents {
  'left-click': {
    polylines: Cartesian3[][]
    point: Cartesian3
  }
  'mouse-move': {
    polylines: Cartesian3[][]
    point: Cartesian3
  }
  'right-click': {
    polylines: Cartesian3[][]
  }
  'left-dbclick': {
    polylines: Cartesian3[][]
  }
}

/**
 * 绘制线
 * @example
 * ```ts
 * const tool = new DrawPolylineTool(options)
 *
 * tool.enable()
 *
 * tool.eventBus.on('left-click', onLeftClick)
 * tool.eventBus.on('mouse-move', onMouseMove)
 * tool.eventBus.on('right-click', onRightClick)
 * tool.eventBus.on('left-dbclick', onLeftDBClick)
 * ```
 */
export class DrawPolylineTool extends DrawPointTool<
  DrawPolylineToolOptions,
  DrawPolylineToolEvents
> {
  /**
   * 绘制完成的线的点
   */
  #lines: Cartesian3[][] = []
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
   * 绘制完成的线实体集合
   */
  #polylineCollection: PrimitiveCollection
  constructor(options: DrawPolylineToolOptions) {
    super(options)
    this.#polylineCollection = this.viewer?.scene.primitives.add(
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
    this.viewer?.scene.primitives.remove(this.#polylineCollection)
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
    this.#polylineCollection?.removeAll()
    this.#lines = []
  }

  onLeftClick = (point: Cartesian3) => {
    this.#floatLinePoints = [point, point]
    const points = this.points.concat()
    if (points.length > 1) {
      const prevLine = this.#curLine
      this.#curLine = this.#createLine(points)
      if (prevLine) {
        this.#polylineCollection?.remove(prevLine)
      }
    }
    this.eventBus.fire('left-click', {
      polylines: this.#lines.concat(),
      point
    })
  }

  onMouseMove = (point: Cartesian3) => {
    const points = this.points.concat()
    if (point && points.length > 0) {
      if (!this.#floatLine) {
        this.#floatLine = this.#createLFloatLine()
      }
      this.#floatLinePoints = [points[points.length - 1], point]
    }
    this.eventBus.fire('mouse-move', {
      polylines: this.#lines.concat(),
      point
    })
  }

  onRightClick = () => {
    this.#validateLine()
    this.#floatLinePoints = []
    this.eventBus.fire('right-click', { polylines: this.#lines.concat() })
  }

  onLeftDBClick = () => {
    this.#validateLine()
    this.#clearFloat()
    this.eventBus.fire('left-dbclick', { polylines: this.#lines.concat() })
  }

  /**
   * 创建线
   * @param positions - 点
   * @returns
   */
  #createLine(positions: Cartesian3[]) {
    const line = this.#polylineCollection?.add(
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

  #validateLine() {
    const points = this.points.concat()
    if (this.#curLine) {
      this.#lines.push(points)
      this.#curLine = undefined
    } else {
      if (points.length === 1) {
        const len = this.pointCollection.length
        const lastPoint = this.pointCollection.get(len - 1)
        this.pointCollection.remove(lastPoint)
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
  }
}
