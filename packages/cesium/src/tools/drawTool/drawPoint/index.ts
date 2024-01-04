/*
 * @Author: zhouyinkui
 * @Date: 2024-01-02 15:54:16
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-04 16:31:34
 * @Description: 画点
 */
import {
  Cartesian3,
  PointPrimitiveCollection,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType
} from 'cesium'
import { getDefault, ToolBaseOptions } from '@mo-yu/core'
import { DrawBase, DrawBaseEvents } from '../drawBase'
import { createPoint, PointOption } from '../../../core/geo/point'
import { getPosiOnAction } from '../../../utils/getPosi'

/**
 * 画点功能入参
 */
export interface DrawPointToolOptions extends ToolBaseOptions {
  /**
   * 点样式
   */
  point?: PointOption
}

/**
 * 画点事件
 */
export interface DrawPointToolEvents extends DrawBaseEvents {
  'left-click': {
    points: Cartesian3[]
    point: Cartesian3
  }
  'mouse-move': {
    points: Cartesian3[]
    point: Cartesian3
  }
  'right-click': {
    points: Cartesian3[]
  }
  'left-dbclick': {
    points: Cartesian3[]
  }
}

/**
 * 绘制点
 * @example
 * ```ts
 * const tool = new DrawPointTool(options)
 *
 * tool.enable()
 *
 * tool.eventBus.on('left-click', onLeftClick)
 * tool.eventBus.on('mouse-move', onMouseMove)
 * tool.eventBus.on('right-click', onRightClick)
 * tool.eventBus.on('left-dbclick', onLeftDBClick)
 * ```
 */
export class DrawPointTool<
  O extends DrawPointToolOptions = DrawPointToolOptions,
  E extends DrawBaseEvents = DrawPointToolEvents
> extends DrawBase<O, E> {
  #handler: ScreenSpaceEventHandler | undefined
  #widgetInputAction: any
  #timer: NodeJS.Timeout | undefined
  protected points: Cartesian3[] = []
  protected pointCollection: PointPrimitiveCollection
  constructor(options: O) {
    super(options)
    this.pointCollection = this.viewer?.scene.primitives.add(
      new PointPrimitiveCollection()
    )
  }

  /**
   * 启用
   */
  enable(): void {
    if (this.viewer) {
      const viewer = this.viewer
      this.#clearDBClick()
      this.#handler = new ScreenSpaceEventHandler(viewer.canvas)

      this.#handler.setInputAction(
        (event: ScreenSpaceEventHandler.PositionedEvent) => {
          clearTimeout(this.#timer)
          this.#timer = setTimeout(() => {
            const position = getPosiOnAction(event.position)
            if (position) {
              createPoint(
                getDefault(
                  {
                    position,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                  },
                  this.options.point
                )
              )
                .then(point => {
                  this.pointCollection.add(point)
                  this.points.push(position)
                  this.onLeftClick(position)
                })
                .catch(err => {
                  console.error(`添加点失败！${err}`)
                })
            }
          }, 200)
        },
        ScreenSpaceEventType.LEFT_CLICK
      )

      this.#handler.setInputAction(
        (event: ScreenSpaceEventHandler.MotionEvent) => {
          this.setCursor('crosshair')
          const position = getPosiOnAction(event.endPosition)
          if (position) {
            this.onMouseMove(position)
          }
        },
        ScreenSpaceEventType.MOUSE_MOVE
      )

      this.#handler.setInputAction(() => {
        this.onRightClick()
      }, ScreenSpaceEventType.RIGHT_CLICK)

      this.#handler.setInputAction(() => {
        this.onLeftDBClick()
        this.stop()
      }, ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    }
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.setCursor('default')
    this.#resetDBClick()
    this.#handler?.destroy()
    this.#handler = undefined
    this.clear()
    this.viewer?.scene.primitives.remove(this.pointCollection)
  }

  /**
   * {@inheritDoc DrawBase.stop}
   * @override
   */
  stop(): void {
    this.setCursor('default')
    this.#resetDBClick()
    this.#handler?.destroy()
    this.#handler = undefined
    clearTimeout(this.#timer)
  }

  /**
   * {@inheritDoc DrawBase.clear}
   * @override
   */
  clear(): void {
    this.pointCollection.removeAll()
    this.points = []
  }

  protected onLeftClick = (point: Cartesian3) => {
    this.eventBus.fire('left-click', {
      points: this.points.concat(),
      point
    })
  }

  protected onMouseMove = (point: Cartesian3) => {
    this.eventBus.fire('mouse-move', {
      points: this.points.concat(),
      point
    })
  }

  protected onRightClick = () => {
    this.eventBus.fire('right-click', { points: this.points.concat() })
  }

  protected onLeftDBClick = () => {
    this.eventBus.fire('left-dbclick', { points: this.points.concat() })
  }

  /**
   * 暂时清除cesium默认双击跟踪实体事件
   */
  #clearDBClick() {
    this.#widgetInputAction =
      this.viewer?.cesiumWidget.screenSpaceEventHandler.getInputAction(
        ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      )
    this.viewer?.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    )
  }

  /**
   * 还原cesium默认双击跟踪实体事件
   */
  #resetDBClick() {
    if (this.#widgetInputAction) {
      this.viewer?.cesiumWidget.screenSpaceEventHandler.setInputAction(
        this.#widgetInputAction,
        ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      )
    }
  }
}
