/*
 * @Author: zhouyinkui
 * @Date: 2023-01-10 14:26:56
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-10 14:30:35
 * @Description: 是否是数字或者数字字符串
 */
/**
 * 是否是数字或者数字字符串
 * @param value - 待测值
 * @returns
 */
export function isNumber(value: any) {
  return parseFloat(`${value}`).toString() !== 'NaN'
}
