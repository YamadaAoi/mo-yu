/*
 * @Author: zhouyinkui
 * @Date: 2023-01-10 10:43:25
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-10 11:28:46
 * @Description: rem hook
 * Copyright (c) 2023 by piesat, All Rights Reserved.
 */
import { ref } from 'vue'
import { remTool } from '@mo-yu/core'

/**
 * rem hook
 * 将rem zoom转为响应式变量
 * 对外暴露remToPx方法
 * @example
 * ```ts
 * const { rem, zoom, remToPx } = useRem()
 * ```
 * @returns
 */
export function useRem() {
  /**
   * 当前1rem等于多少px
   */
  const rem = ref(remTool.rem)
  /**
   * 当前body缩放倍数
   */
  const zoom = ref(remTool.zoom)

  remTool.eventBus.on('rem-refresh', e => {
    rem.value = e.rem
    zoom.value = e.zoom
  })

  /**
   * 获取rem数值对应的px值
   * @example
   * ```ts
   * // 若当前rem值为100px，将打印150
   * console.log(remToPx(1.5))
   * ```
   * @param r - rem值
   * @returns
   */
  function remToPx(r: number) {
    return Math.floor(rem.value * r)
  }

  return {
    rem,
    zoom,
    remToPx
  }
}
