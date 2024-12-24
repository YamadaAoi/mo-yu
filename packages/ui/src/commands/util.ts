/*
 * @Author: zhouyinkui
 * @Date: 2024-12-23 16:33:57
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-12-24 15:08:48
 * @Description:
 */
import { magenta, yellow, blue, green } from 'kleur/colors'

export interface ComponentInfo {
  name: string
  path: string
  dependencies: string[]
}

/**
 * 控制台颜色
 */
export const psColor = {
  success: green,
  error: magenta,
  warn: yellow,
  info: blue
}

/**
 * 日志颜色
 */
export const log = {
  success: (...args: unknown[]) => {
    console.log(psColor.success(args.join(' ')))
  },
  error: (...args: unknown[]) => {
    console.log(psColor.error(args.join(' ')))
  },
  warn: (...args: unknown[]) => {
    console.log(psColor.warn(args.join(' ')))
  },
  info: (...args: unknown[]) => {
    console.log(psColor.info(args.join(' ')))
  },
  /**
   * 换行
   */
  bkl: () => {
    console.log('')
  }
}
