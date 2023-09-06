/*
 * @Author: zhouyinkui
 * @Date: 2023-02-07 09:59:03
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-02-08 09:59:11
 * @Description: locale hook
 */
import { computed, ref } from 'vue'
import { LocaleKeys, LocaleTool } from '@mo-yu/core'

/**
 * locale hook
 * 提供响应式国际化切换能力
 * 可以考虑二次封装，不要每次都传入LocaleTool类实例
 * @example
 * ```ts
 * const { language, current, changeLanguage, i18n } = useLocale(locale)
 * changeLanguage('zh_cn')
 * ```
 * @param locale - LocaleTool类实例，项目中一般共用一个实例
 * @returns
 */
export function useLocale<T, C>(locale: LocaleTool<T, C>) {
  /**
   * 当前语言环境
   */
  const language = ref<T>()
  /**
   * 当前语言环境的语言配置
   */
  const current = computed(() => {
    return language.value ? locale.cache.get(language.value)?.config : undefined
  })

  locale.eventBus.on('language-change', e => {
    language.value = e.language
  })

  /**
   * 改变语言环境
   * @param type - 国际化语言类型
   */
  function changeLanguage(type: T) {
    locale.changeLanguage(type)
  }

  /**
   * 根据国际化键值返回字符串
   * @param key - 国际化键值，例如'common.confirm'
   * @returns
   */
  function i18n(key: LocaleKeys<C>) {
    return locale.i18n(key)
  }

  return {
    language,
    current,
    changeLanguage,
    i18n
  }
}
