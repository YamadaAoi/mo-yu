/*
 * @Author: zhouyinkui
 * @Date: 2023-01-18 13:43:43
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-18 16:55:20
 * @Description: 全屏工具实现类
 * Copyright (c) 2023 by piesat, All Rights Reserved.
 */
import { ToolBase, ToolBaseOptions } from '../baseTool'

/**
 * 全屏工具入参
 */
export interface FullscreenToolOptions extends ToolBaseOptions {
  /**
   * 要全屏的html元素
   */
  target?: HTMLElement
}

/**
 * 全屏工具事件
 */
interface FullscreenToolEvents {
  /**
   * 全屏状态切换事件
   */
  'screen-change': {
    /**
     * 发送当前全屏状态
     */
    status: boolean
  }
}

/**
 * 全屏
 * @example
 * ```ts
 * const tool = new FullscreenTool({
 *  target: HTMLElement
 * })
 *
 * tool.enable()
 * tool.toggleFullscreen()
 * ```
 */
export class FullscreenTool extends ToolBase<
  FullscreenToolOptions,
  FullscreenToolEvents
> {
  #fullscreen = false
  #target: any = document.body
  #supportFullscreen: boolean | undefined
  #funcNames = {
    requestFullscreen: '',
    exitFullscreen: '',
    fullscreenEnabled: '',
    fullscreenElement: '',
    fullscreenchange: '',
    fullscreenerror: ''
  }
  constructor(options: FullscreenToolOptions) {
    super(options)
    if (options.target instanceof HTMLElement) {
      this.#target = options.target
    } else {
      console.warn("全屏工具入参'target'必须是 DOM 元素！")
    }
  }

  /**
   * {@inheritDoc ToolBase.enable}
   * @override
   */
  enable(): void {
    if (this.isSupported()) {
      window.document.addEventListener(
        this.#funcNames.fullscreenchange,
        this.fullscreenChange
      )
    } else {
      console.warn('此设备不支持全屏模式！')
    }
  }

  /**
   * {@inheritDoc ToolBase.destroy}
   * @override
   */
  destroy(): void {
    if (this.isSupported()) {
      window.document.removeEventListener(
        this.#funcNames.fullscreenchange,
        this.fullscreenChange
      )
    }
  }

  /**
   * 切换全屏状态
   */
  toggleFullscreen() {
    if (this.isSupported()) {
      if (this.#fullscreen) {
        ;(document as any)[this.#funcNames.exitFullscreen]()
      } else {
        this.#target[this.#funcNames.requestFullscreen]()
      }
    }
  }

  private fullscreenChange = () => {
    if (this.isSupported()) {
      const fullscreenElement = (document as any)[
        this.#funcNames.fullscreenElement
      ]
      if ((fullscreenElement === this.#target) !== this.#fullscreen) {
        this.#fullscreen = !this.#fullscreen
        this.eventBus.fire('screen-change', {
          status: this.#fullscreen
        })
      }
    }
  }

  private isSupported() {
    if (this.#supportFullscreen !== undefined) {
      return this.#supportFullscreen
    }

    this.#supportFullscreen = false

    const doc: any = document
    const body: any = document.body
    if (typeof body.requestFullscreen === 'function') {
      this.#funcNames = {
        requestFullscreen: 'requestFullscreen',
        exitFullscreen: 'exitFullscreen',
        fullscreenEnabled: 'fullscreenEnabled',
        fullscreenElement: 'fullscreenElement',
        fullscreenchange: 'fullscreenchange',
        fullscreenerror: 'fullscreenerror'
      }
      this.#supportFullscreen = true
      return this.#supportFullscreen
    }

    const prefixes = ['webkit', 'moz', 'o', 'ms', 'khtml']
    prefixes.forEach(p => {
      if (typeof body[`${p}RequestFullscreen`] === 'function') {
        this.#funcNames.requestFullscreen = `${p}RequestFullscreen`
        this.#supportFullscreen = true
      } else if (typeof body[`${p}RequestFullScreen`] === 'function') {
        this.#funcNames.requestFullscreen = `${p}RequestFullScreen`
        this.#supportFullscreen = true
      }

      if (typeof doc[`${p}ExitFullscreen`] === 'function') {
        this.#funcNames.exitFullscreen = `${p}ExitFullscreen`
      } else if (typeof doc[`${p}CancelFullScreen`] === 'function') {
        this.#funcNames.exitFullscreen = `${p}CancelFullScreen`
      }

      if (doc[`${p}FullscreenEnabled`] !== undefined) {
        this.#funcNames.fullscreenEnabled = `${p}FullscreenEnabled`
      } else if (doc[`${p}FullScreenEnabled`] !== undefined) {
        this.#funcNames.fullscreenEnabled = `${p}FullScreenEnabled`
      }

      if (doc[`${p}FullscreenElement`] !== undefined) {
        this.#funcNames.fullscreenElement = `${p}FullscreenElement`
      } else if (doc[`${p}FullScreenElement`] !== undefined) {
        this.#funcNames.fullscreenElement = `${p}FullScreenElement`
      }

      if (doc[`on${p}fullscreenchange`] !== undefined) {
        if (p === 'ms') {
          this.#funcNames.fullscreenchange = 'MSFullscreenChange'
        } else {
          this.#funcNames.fullscreenchange = `${p}fullscreenchange`
        }
      }

      if (doc[`on${p}fullscreenerror`] !== undefined) {
        if (p === 'ms') {
          this.#funcNames.fullscreenerror = 'MSFullscreenError'
        } else {
          this.#funcNames.fullscreenerror = `${p}fullscreenchange`
        }
      }
    })

    return this.#supportFullscreen
  }
}
