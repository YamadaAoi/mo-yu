/*
 * @Author: zhouyinkui
 * @Date: 2024-01-02 15:39:19
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-03 17:48:09
 * @Description: 绘制抽象类
 */
import { ToolBase, ToolBaseOptions } from '@mo-yu/core'
import { mapStoreTool } from '../storeTool'

/**
 * 鼠标样式
 */
export type CursorProperty =
  | '-moz-grab'
  | '-webkit-grab'
  | 'alias'
  | 'all-scroll'
  | 'auto'
  | 'cell'
  | 'col-resize'
  | 'context-menu'
  | 'copy'
  | 'crosshair'
  | 'default'
  | 'e-resize'
  | 'ew-resize'
  | 'grab'
  | 'grabbing'
  | 'help'
  | 'move'
  | 'n-resize'
  | 'ne-resize'
  | 'nesw-resize'
  | 'no-drop'
  | 'none'
  | 'not-allowed'
  | 'ns-resize'
  | 'nw-resize'
  | 'nwse-resize'
  | 'pointer'
  | 'progress'
  | 'row-resize'
  | 's-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'text'
  | 'vertical-text'
  | 'w-resize'
  | 'wait'
  | 'zoom-in'
  | 'zoom-out'

/**
 * 绘制基础事件
 */
export interface DrawBaseEvents {
  'left-click': object
  'mouse-move': object
  'right-click': object
  'left-dbclick': object
}

/**
 * 绘制工具抽象类
 */
export abstract class DrawBase<
  O extends ToolBaseOptions,
  E extends DrawBaseEvents
> extends ToolBase<O, E> {
  constructor(options: O) {
    super(options)
  }

  /**
   * 传递本轮绘制结果，不再绘制，不清空绘制结果
   * @virtual
   */
  abstract stop(): void

  /**
   * 清空绘制结果，等待下轮绘制
   * @virtual
   */
  abstract clear(): void

  protected get viewer() {
    return mapStoreTool.getMap()?.viewer
  }

  /**
   * 更改鼠标样式
   * @param type -
   */
  protected setCursor(type: CursorProperty) {
    if (this.viewer?.canvas) {
      this.viewer.canvas.style.cursor = type
    }
  }
}
