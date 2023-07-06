/*
 * @Author: zhouyinkui
 * @Date: 2023-01-05 15:20:47
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-07-06 09:58:01
 * @Description:
 * Copyright (c) 2023 by piesat, All Rights Reserved.
 */
import { ToolBase } from '../baseTool'

/**
 * Rem入参
 */
interface RemToolOptions {
  /**
   * 设计稿宽度
   */
  designWidth: number
  /**
   * 设计稿高度
   */
  designHeight?: number
  /**
   * h5不在意devicePixelRatio
   */
  ignoreDevicePixelRatio?: boolean
}

/**
 * Rem事件
 */
interface RemToolEvents {
  /**
   * Rem刷新事件
   */
  'rem-refresh': {
    rem: number
    zoom: number
  }
}

/**
 * PC端Rem适配方案
 */
class RemTool extends ToolBase<RemToolOptions, RemToolEvents> {
  #remStyle = document.createElement('style')
  #timer: NodeJS.Timeout | undefined
  #designWidth: number
  #designHeight: number | undefined
  #ignoreDevicePixelRatio = false
  #rem!: number
  #zoom = 1
  constructor(options: RemToolOptions) {
    super(options)
    this.#designWidth = options.designWidth
    this.#designHeight = options.designHeight
    this.#ignoreDevicePixelRatio = !!options.ignoreDevicePixelRatio
  }

  /**
   * {@inheritDoc ToolBase.enable}
   * @override
   */
  enable() {
    if (document.documentElement.firstElementChild) {
      document.documentElement.firstElementChild.appendChild(this.#remStyle)
    } else {
      const wrap = document.createElement('div')
      wrap.appendChild(this.#remStyle)
      document.write(wrap.innerHTML)
    }
    // 要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；
    this.refreshRem()

    window.addEventListener('resize', this.listenResize, false)

    window.addEventListener('pageshow', this.listenPageshow, false)

    if (document.readyState === 'complete') {
      document.body.style.fontSize = '16px'
    } else {
      document.addEventListener(
        'DOMContentLoaded',
        this.domContentLoaded,
        false
      )
    }
  }

  /**
   * {@inheritDoc ToolBase.destroy}
   * @override
   */
  destroy() {
    window.removeEventListener('resize', this.listenResize)
    window.removeEventListener('pageshow', this.listenPageshow)
    document.removeEventListener('DOMContentLoaded', this.domContentLoaded)
  }

  /**
   * 重置设计图尺寸
   * @param designWidth - 设计稿宽度
   * @param designHeight - 设计稿高度
   */
  resetDesignSize(designWidth: number, designHeight?: number) {
    this.#designWidth = designWidth
    this.#designHeight = designHeight
  }

  /**
   * 当前1rem等于多少px
   */
  get rem() {
    return this.#rem
  }

  /**
   * 当前body被缩放了多少倍
   * 在遇到echarts、各种地图上点击或拖拽位置不准的情况时，需要获取该值在对应dom上反向缩放
   */
  get zoom() {
    return this.#zoom
  }

  private readonly refreshRem = () => {
    const width = document.documentElement.getBoundingClientRect().width
    const height = document.documentElement.getBoundingClientRect().height
    if (this.#ignoreDevicePixelRatio) {
      this.#rem = (width * 100) / this.#designWidth
    } else {
      const ratio = window.devicePixelRatio ?? 1
      const style: any = document.body.style
      if (this.#designHeight) {
        this.#rem =
          (width * height * 100) / (this.#designWidth * this.#designHeight)
      } else {
        this.#rem = (width * 100) / this.#designWidth
      }
      if (width > this.#designWidth) {
        this.#rem = this.#rem / ratio
        this.#zoom = (ratio * this.#designWidth) / width
      } else {
        this.#rem = this.#rem * ratio
        this.#zoom = this.#designWidth / (ratio * width)
      }
      style.zoom = this.#zoom
    }
    this.#remStyle.innerHTML = `html{font-size:${this.#rem}px;}`
    this.eventBus.fire('rem-refresh', {
      rem: this.#rem,
      zoom: this.#zoom
    })
  }

  private readonly domContentLoaded = () => {
    document.body.style.fontSize = '16px'
  }

  private readonly listenResize = () => {
    if (this.#timer) {
      clearTimeout(this.#timer) // 防止执行两次
    }
    this.#timer = setTimeout(this.refreshRem, 300)
  }

  private readonly listenPageshow = (e: any) => {
    if (e.persisted) {
      if (this.#timer) {
        clearTimeout(this.#timer) // 防止执行两次
      }
      this.#timer = setTimeout(this.refreshRem, 300)
    }
  }
}

/**
 * PC端Rem适配方案
 * 设计稿默认1920
 * 设计稿100px = 1rem
 * 会基于devicePixelRatio和设计稿缩放body
 * @example
 * ```ts
 * import { remTool } from '@mo-yu/core'
 *
 * remTool.resetDesignSize(1440)
 * remTool.enable()
 * remTool.eventBus.on('rem-refresh', e => {
 *   console.log(e.zoom, e.rem)
 * })
 * ```
 */
const remTool = new RemTool({ designWidth: 1920 })

export { remTool }
