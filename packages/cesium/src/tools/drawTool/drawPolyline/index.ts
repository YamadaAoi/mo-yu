/*
 * @Author: zhouyinkui
 * @Date: 2024-01-02 17:54:31
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-08 13:12:36
 * @Description: 画线
 */
import {
  CallbackProperty,
  Cartesian3,
  Color,
  Entity,
  PolylineDashMaterialProperty,
  PrimitiveCollection
} from 'cesium'
import { getDefault } from '@mo-yu/core'
import {
  createPolyline,
  PolylineOption
} from '../../../core/geo/primitive/polyline'
import { DrawPointTool, DrawPointToolOptions } from '../drawPoint'
import { DrawBaseEvents } from '../drawBase'
import {
  PolylineEntityOption,
  createEntityPolyline
} from '../../../core/geo/entity/polyline'
import { defaultColor } from '../../../core/defaultVal'
import { getMeterialProperty } from '../../../core/material'

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
  floatPolyline?: PolylineEntityOption
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
export class DrawPolylineTool<
  O extends DrawPolylineToolOptions = DrawPolylineToolOptions,
  E extends DrawBaseEvents = DrawPolylineToolEvents
> extends DrawPointTool<O, E> {
  /**
   * 绘制完成的线的点
   */
  #lines: Cartesian3[][] = []
  /**
   * 绘制中的线实体
   */
  protected curLine: any | undefined
  /**
   * 移动的线的点
   */
  protected floatLinePoints: Cartesian3[] = []
  /**
   * 移动的线实体
   */
  protected floatLine: Entity | undefined
  /**
   * 绘制完成的实体集合
   */
  protected polyCollection: PrimitiveCollection
  constructor(options: O) {
    super(options)
    this.polyCollection = this.viewer?.scene.primitives.add(
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
    this.viewer?.scene.primitives.remove(this.polyCollection)
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
    this.polyCollection?.removeAll()
    this.#lines = []
  }

  protected onLeftClick = (point: Cartesian3) => {
    this.handleLineLeftClick(point)
    this.eventBus.fire('left-click', {
      polylines: this.#lines.concat(),
      point
    })
  }

  protected onMouseMove = (point: Cartesian3) => {
    const points = this.points.concat()
    if (point && points.length > 0) {
      if (!this.floatLine) {
        this.floatLine = this.createLFloatLine()
      }
      this.floatLinePoints = [points[points.length - 1], point]
    }
    this.eventBus.fire('mouse-move', {
      polylines: this.#lines.concat(),
      point
    })
  }

  protected onRightClick = () => {
    this.#validateLine()
    this.floatLinePoints = []
    this.eventBus.fire('right-click', { polylines: this.#lines.concat() })
  }

  protected onLeftDBClick = () => {
    this.#validateLine()
    this.clearFloat()
    this.eventBus.fire('left-dbclick', { polylines: this.#lines.concat() })
  }

  /**
   * 处理线鼠标左击事件
   * @param point - 点
   */
  protected handleLineLeftClick(point: Cartesian3) {
    this.floatLinePoints = [point, point]
    const points = this.points.concat()
    if (points.length > 1) {
      const prevLine = this.curLine
      this.curLine = this.createLine(points)
      if (prevLine) {
        this.polyCollection?.remove(prevLine)
      }
    }
  }

  /**
   * 清除浮动实体
   */
  protected clearFloat() {
    this.floatLinePoints = []
    if (this.floatLine) {
      this.viewer?.entities.remove(this.floatLine)
    }
    this.floatLine = undefined
  }

  /**
   * 创建线
   * @param positions - 点
   * @returns
   */
  protected createLine(positions: Cartesian3[]) {
    const line = this.polyCollection?.add(
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
  protected createLFloatLine() {
    const m =
      getMeterialProperty(this.options.floatPolyline?.material) ?? defaultColor
    const dM =
      getMeterialProperty(this.options.floatPolyline?.depthFailMaterial) ??
      defaultColor
    const option = getDefault(
      {
        positions: new CallbackProperty(() => {
          return this.floatLinePoints
        }, false),
        width: 2
      },
      this.options.floatPolyline
    )
    if (m instanceof Color) {
      option.material = new PolylineDashMaterialProperty({ color: m })
    }
    if (dM instanceof Color) {
      option.depthFailMaterial = new PolylineDashMaterialProperty({ color: dM })
    }
    const line = this.viewer?.entities.add(createEntityPolyline(option))
    return line
  }

  #validateLine() {
    const points = this.points.concat()
    if (this.curLine) {
      this.#lines.push(points)
      this.curLine = undefined
    } else {
      if (points.length === 1) {
        const len = this.pointCollection.length
        const lastPoint = this.pointCollection.get(len - 1)
        this.pointCollection.remove(lastPoint)
      }
    }
    this.points = []
  }
}
