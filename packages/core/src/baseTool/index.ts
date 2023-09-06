/*
 * @Author: zhouyinkui
 * @Date: 2022-07-27 15:45:03
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-06 14:57:27
 * @Description: 工具抽象类
 */
import { EventBus } from '../utils/evented'

/**
 * 实例化基本参数
 */
export interface ToolBaseOptions {}

/**
 * 工具抽象类
 * @typeParam O - 类构造入参
 * @typeParam T - 类事件类型
 */
export abstract class ToolBase<O extends ToolBaseOptions, T> {
  protected options: O
  #eventBus: EventBus<T> = new EventBus()
  constructor(options: O) {
    this.options = options
  }

  /**
   * 功能启用
   * @virtual
   */
  abstract enable(): void

  /**
   * 功能销毁
   * @virtual
   */
  abstract destroy(): void

  /**
   * 事件总线
   * @example
   * ```ts
   * const tool = new SomeClass()
   * tool.eventBus.on('some-event', e => {
   *   console.log(e)
   * )
   * ```
   */
  get eventBus(): EventBus<T> {
    return this.#eventBus
  }
}
