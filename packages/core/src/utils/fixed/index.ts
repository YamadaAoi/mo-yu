/*
 * @Author: zhouyinkui
 * @Date: 2023-01-10 14:31:12
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-10 14:31:14
 * @Description: 保留len位小数
 */
import { isNumber } from '../isNumber'

/**
 * 保留len位小数
 * @param value - 数值
 * @param len - 默认保留两位小数
 * @returns
 */
export function fixed(value: any, len = 2) {
  if (isNumber(value)) {
    const a = Math.pow(10, len)
    return Math.floor(value * a) / a
  } else {
    return value
  }
}
