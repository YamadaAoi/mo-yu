/*
 * @Author: zhouyinkui
 * @Date: 2023-01-10 14:24:00
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-10 14:24:01
 * @Description:
 */
import { InjectionKey } from 'vue'

/**
 * vue3注入key
 * @param key -
 * @returns
 */
export function createInjectKey<T>(key: string): InjectionKey<T> {
  return key as any
}
