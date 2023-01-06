/*
 * @Author: zhouyinkui
 * @Date: 2023-01-06 17:25:14
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-06 17:25:15
 * @Description: 公共方法
 * Copyright (c) 2023 by piesat, All Rights Reserved.
 */
/**
 * 生成唯一id
 * @returns id
 */
export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
