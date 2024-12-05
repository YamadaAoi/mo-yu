/*
 * @Author: zhouyinkui
 * @Date: 2023-01-10 10:43:25
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-12-05 16:42:47
 * @Description: rem hook
 */
import { ref } from 'vue'
import { remTool } from '@mo-yu/core'

/**
 * rem hook
 * 将rem zoom转为响应式变量
 * 对外暴露remToPx方法
 * @example
 * ```ts
 * const { rem, remToPx } = useRem()
 * ```
 * @returns
 */
export function useRem() {
  /**
   * 当前1rem等于多少px
   */
  const rem = ref(remTool.rem)

  remTool.eventBus.on('rem-refresh', e => {
    rem.value = e.rem
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

  /**
   * 获取设计稿元素尺寸(px)在当前屏幕下实际的px值
   * @example
   * ```ts
   * // 若当前rem值为100px，将打印150
   * console.log(remToPx(150))
   * ```
   * @param r - 设计稿元素尺寸(px)
   * @returns
   */
  function pxNow(r: number) {
    return Math.floor((rem.value * r) / 100)
  }

  return {
    rem,
    remToPx,
    pxNow
  }
}
