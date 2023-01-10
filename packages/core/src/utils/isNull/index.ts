/*
 * @Author: zhouyinkui
 * @Date: 2023-01-10 14:30:17
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-10 14:36:09
 * @Description: 是无效数据
 * Copyright (c) 2023 by piesat, All Rights Reserved.
 */
/**
 * 是无效数据
 * @param value - 任意数据
 * @returns
 */
export function isNull(value: any) {
  return undefined === value || null === value || '' === value
}
