/*
 * @Author: zhouyinkui
 * @Date: 2023-01-10 14:26:01
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-10 14:26:02
 * @Description: 生成唯一id
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
