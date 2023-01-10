/*
 * @Author: zhouyinkui
 * @Date: 2023-01-10 14:32:12
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-10 14:32:13
 * @Description: 初始化变量
 * Copyright (c) 2023 by piesat, All Rights Reserved.
 */
/**
 * 初始化变量
 * @param defaultValue - 默认值
 * @param initial - 初始值
 * @returns
 */
export function getDefault<D>(defaultValue: D, initial?: D): D {
  let val = defaultValue
  if (initial) {
    val = { ...defaultValue, ...initial }
  }
  return val
}
