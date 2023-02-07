/*
 * @Author: zhouyinkui
 * @Date: 2023-02-06 16:40:03
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-02-07 14:37:34
 * @Description: 国际化工具实现类
 * Copyright (c) 2023 by piesat, All Rights Reserved.
 */
import { ToolBase, ToolBaseOptions } from '../baseTool'

/**
 * 组装国际化key
 */
type GenKey<Prefix, Keys> = `${Prefix & string}.${Keys & string}`

/**
 * 对象递归最大深度
 */
type Pred = [never, 0, 1, 2, 3]

/**
 * 获取国际化配置所有类型
 */
type GetKeys<Config, D extends number = 4> = {
  [K in keyof Config]: Config[K] extends object
    ? [D] extends [0]
      ? K & string
      : GenKey<K, GetKeys<Config[K], Pred[D]>>
    : K & string
}[keyof Config]

/**
 * 国际化配置所有键值
 */
export type LocaleKeys<Config> = GetKeys<Required<Config>>

/**
 * 国际化事件
 */
interface LocaleToolEvents<T> {
  /**
   * 语言环境变化事件
   */
  'language-change': {
    language: T
  }
}

/**
 * 国际化数据缓存
 */
interface LocaleCache<C> {
  generate: () => Promise<any>
  promise?: Promise<any>
  config?: C
}

/**
 * 国际化工具类
 * T - 语言类型，例如'zh_cn' | 'en_us'
 * C - 语言配置，是一个简单的object类型，字段类型为string或object
 *
 * @example
 * ```ts
 * type LocaleType = 'zh_cn' | 'en_us'
 *
 * interface LocaleConfig {
 *   common: {
 *     confirm: string
 *     cancel: string
 *   }
 * }
 *
 * const locale = new LocaleTool<LocaleType, LocaleConfig>({})
 * locale.setLocale('zh_cn', () => import('../../locale/zh_cn'))
 * locale.setLocale('en_us', () => import('../../locale/en_us'))
 * locale.changeLanguage('zh_cn')
 * console.log(locale.current?.common.confirm)
 * console.log(locale.i18n('common.confirm'))
 * ```
 */
export class LocaleTool<T, C> extends ToolBase<
  ToolBaseOptions,
  LocaleToolEvents<T>
> {
  #cache = new Map<T, LocaleCache<C>>()
  #language: T | undefined

  /**
   * {@inheritDoc ToolBase.enable}
   * @override
   */
  enable(): void {
    //
  }

  /**
   * {@inheritDoc ToolBase.destroy}
   * @override
   */
  destroy(): void {
    this.#cache.clear()
  }

  /**
   * 设置国际化配置
   * @param type - 国际化语言类型
   * @param generate - 国际化配置Promise，配置文件内以export default方式返回配置项
   * @example
   * ```ts
   * locale.setLocale('en_us', () => import('../../locale/en_us'))
   * ```
   */
  setLocale(type: T, generate: () => Promise<any>) {
    this.#cache.set(type, { generate })
  }

  /**
   * 根据国际化键值返回字符串
   * @param key - 国际化键值，例如'common.confirm'
   * @returns
   */
  i18n(key: GetKeys<C>) {
    let word = ''
    const arr = key?.split('.')
    try {
      let temp: any = this.current
      arr?.forEach((a: any) => {
        temp = temp[a]
      })
      if (typeof temp === 'string') {
        word = temp
      }
    } catch (error) {
      console.error(`【i18n】：${key}不存在！`)
    }

    return word
  }

  /**
   * 改变语言环境
   * @param language - 国际化语言类型
   */
  changeLanguage(language: T) {
    this.setLanguage(language)
      .then(config => {
        if (config) {
          this.#language = language
          this.eventBus.fire('language-change', {
            language
          })
        }
      })
      .catch(err => {
        console.error(err)
      })
  }

  /**
   * 获取多个语言环境缓存
   */
  get cache() {
    return this.#cache
  }

  /**
   * 获取当前语言环境语言配置
   */
  get current() {
    return this.#language ? this.#cache.get(this.#language)?.config : undefined
  }

  private async setLanguage(type: T) {
    const cache = this.#cache.get(type)
    if (cache) {
      if (cache.config) {
        return cache.config
      } else if (cache.promise) {
        const res = await cache.promise
        return res?.default
      } else {
        const promise = cache.generate()
        this.#cache.set(type, { ...cache, promise })
        const res = await promise
        const config = res?.default
        if (config) {
          this.#cache.set(type, { ...cache, config })
        } else {
          this.#cache.set(type, cache)
        }
        return config
      }
    }
  }
}
