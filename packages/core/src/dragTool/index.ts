/*
 * @Author: zhouyinkui
 * @Date: 2023-01-05 15:37:41
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-12-04 10:11:57
 * @Description: 拖拽工具实现类
 */
import { ToolBase, ToolBaseOptions } from '../baseTool'

/**
 * 拖拽工具入参
 */
export interface DragToolOptions extends ToolBaseOptions {
  /**
   * 点击拖拽的元素id
   */
  handleId: string
  /**
   * 可拖拽的范围，在某个父元素节点内
   * 默认为document.body
   */
  wrapId?: string
  /**
   * 需要拖拽移动的根元素id，此元素应包含handleId
   * 例如，handleId是一个弹框的头部，targetId是这个弹框本身（包含头部）
   */
  targetId?: string
}

/**
 * 默认位置
 * 居中，右上，右下，右中
 */
export type OriginPosition =
  | 'center'
  | 'right-top'
  | 'right-bottom'
  | 'right-center'

/**
 * 全屏拖拽
 * @example
 * ```ts
 * const drag = new DragTool({
 *  handleId: '',
 *  targetId: ''
 * })
 *
 * drag.enable()
 * drag.locate('center')
 * ```
 */
export class DragTool extends ToolBase<DragToolOptions, any> {
  #handleId: string
  #targetId: string | undefined
  #wrapId: string | undefined
  #size = {
    distX: 0,
    distY: 0
  }
  #isDragging = false
  #matrix3dReg =
    /^matrix3d\((?:[-\d.]+,\s*){12}([-\d.]+),\s*([-\d.]+)(?:,\s*[-\d.]+){2}\)/
  #matrixReg = /^matrix\((?:[-\d.]+,\s*){4}([-\d.]+),\s*([-\d.]+)\)$/
  constructor(options: DragToolOptions) {
    super(options)
    this.#handleId = options.handleId
    this.#targetId = options.targetId
    this.#wrapId = options.wrapId
  }

  /**
   * {@inheritDoc ToolBase.enable}
   * @override
   */
  enable(): void {
    if (this.handle) {
      this.handle.addEventListener('mousedown', this.mouseDown, false)
    }
  }

  /**
   * {@inheritDoc ToolBase.destroy}
   * @override
   */
  destroy(): void {
    if (this.handle) {
      this.handle.removeEventListener('mousedown', this.mouseDown)
      document.removeEventListener('mouseup', this.mouseUp)
      document.removeEventListener('mousemove', this.handleMouseMove)
      this.#isDragging = false
    }
  }

  /**
   * 定位拖动元素到设定位置
   * @param position - 位置
   */
  locate(position?: OriginPosition) {
    const el = this.target ?? this.handle
    if (el) {
      // 获取可见窗口大小
      const bodyW = this.wrap.clientWidth
      const bodyH = this.wrap.clientHeight
      // 获取对话框宽、高
      const elW = el.offsetWidth
      const elH = el.offsetHeight
      if (position === undefined || position === 'center') {
        el.style.transform = `translate3d(${(bodyW - elW) / 2}px,${
          (bodyH - elH) / 2
        }px,1px)`
      } else if (position === 'right-center') {
        el.style.transform = `translate3d(${bodyW - elW - 16}px,${
          (bodyH - elH) / 2
        }px,1px)`
      } else if (position === 'right-top') {
        el.style.transform = `translate3d(${bodyW - elW - 16}px,16px,1px)`
      } else if (position === 'right-bottom') {
        el.style.transform = `translate3d(${bodyW - elW - 16}px,${
          bodyH - elH - 16
        }px,1px)`
      }
    }
  }

  private mouseDown = (ev: MouseEvent) => {
    const oEvent = ev || window.event
    const el = this.target ?? this.handle
    if (oEvent && el) {
      oEvent.stopPropagation?.()
      oEvent.preventDefault?.()
      const matrix3dSourceValue = this.getStyle(el, 'transform')
      const matrix3dArrValue =
        matrix3dSourceValue.match(this.#matrix3dReg) ??
        matrix3dSourceValue.match(this.#matrixReg)
      const clientX = oEvent.clientX
      const clientY = oEvent.clientY
      const targetX = matrix3dArrValue?.[1] ?? 0
      const targetY = matrix3dArrValue?.[2] ?? 0
      this.#size.distX = clientX - targetX
      this.#size.distY = clientY - targetY
      this.#isDragging = true
      const options = { passive: false }
      document.addEventListener('mousemove', this.handleMouseMove, options)
      document.addEventListener('mouseup', this.mouseUp, false)
    }
  }

  private mouseUp = (ev: MouseEvent) => {
    const oEvent = ev || window.event
    oEvent?.stopPropagation?.()
    oEvent?.preventDefault?.()
    this.#isDragging = false
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.mouseUp)
  }

  private handleMouseMove = (ev: MouseEvent) => {
    const oEvent = ev || window.event
    const el: any = this.target ?? this.handle
    const bodyW = this.wrap.clientWidth
    const bodyH = this.wrap.clientHeight
    if (oEvent && this.#isDragging && el) {
      oEvent.stopPropagation?.()
      oEvent.preventDefault?.()
      const elW = el.offsetWidth
      const elH = el.offsetHeight
      const maxX = bodyW - elW
      const maxY = bodyH - elH
      const moveX = Math.min(
        Math.max(0, oEvent.clientX - this.#size.distX),
        maxX
      )
      const moveY = Math.min(
        Math.max(0, oEvent.clientY - this.#size.distY),
        maxY
      )
      el.style.transform =
        el.style.mozTransform =
        el.style.webkitTransform =
          `translate3d(${moveX}px, ${moveY}px, 1px)`
    }
  }

  private getStyle(el: any, attr: keyof CSSStyleDeclaration) {
    if (typeof window.getComputedStyle !== 'undefined') {
      return window.getComputedStyle(el, null)[attr]
    } else if (el.currentStyle) {
      return el.currentStyle[attr]
    }
    return ''
  }

  private get handle() {
    return document.getElementById(this.#handleId)
  }

  private get target() {
    return this.#targetId ? document.getElementById(this.#targetId) : null
  }

  private get wrap() {
    return this.#wrapId
      ? document.getElementById(this.#wrapId) ?? document.body
      : document.body
  }
}
