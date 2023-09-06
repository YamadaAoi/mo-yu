/*
 * @Author: zhouyinkui
 * @Date: 2023-01-10 14:46:37
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-10 15:00:12
 * @Description:
 */
import { inject } from 'vue'
import { createInjectKey } from '../../../utils/createInjectKey'

/**
 * loading注入方法
 */
export interface LoadingInjection {
  /**
   * 添加loading，返回取消当前loading实例的方法
   * 传递等待时间second，单位秒，默认60s，等待时间达到后自动销毁
   */
  addLoading: (second?: number) => () => void
  /**
   * 强制销毁当前所有的loading实例，谨慎使用
   */
  removeAllLoading: () => void
}

/**
 * loading provider方法注入id
 */
export const LoadingInjectionKey =
  createInjectKey<LoadingInjection>('loading-api')

/**
 * 全局共享loading方法
 * @example
 * ```ts
 * import { useLoading } from '@mo-yu/vue'
 *
 * const { addLoading } = useLoading()
 *
 * const remove = addLoading()
 * fetchSomething().then(()=>{
 *  remove()
 * }).catch(()=>{
 *  remove()
 * })
 * ```
 * @returns
 */
export function useLoading() {
  const api = inject(LoadingInjectionKey, null)
  if (api === null) {
    throw new Error('注入loading方法失败！')
  }
  return api
}
