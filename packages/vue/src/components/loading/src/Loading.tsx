/*
 * @Author: zhouyinkui
 * @Date: 2023-01-10 13:35:20
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-10 17:38:15
 * @Description: Loading Provider
 */
import './loading.scss'
import { defineComponent, ref, Teleport, provide, h, Fragment } from 'vue'
import { guid } from '@mo-yu/core'
import { LoadingInjectionKey } from './loading_able'

interface LoadItem {
  id: string
  timer: NodeJS.Timeout
}

/**
 * loading遮罩组件，需要将项目代码包裹在MLoading内
 * @example
 * ```html
 * <m-loading>
 *  <router-view />
 * </m-loading>
 * ```
 */
export default defineComponent({
  name: 'MLoading',
  setup() {
    const loadEvents = ref<LoadItem[]>([])

    provide(LoadingInjectionKey, { addLoading, removeAllLoading })

    function addLoading(second = 60) {
      const id = guid()
      const loading: LoadItem = {
        id,
        timer: setTimeout(() => {
          removeLoading(id, true)
        }, second * 1000)
      }
      loadEvents.value = loadEvents.value.concat([loading])
      return removeLoading.bind(null, id, false)
    }

    function removeAllLoading() {
      loadEvents.value.forEach(l => {
        if (l.timer) {
          clearTimeout(l.timer)
        }
      })
      loadEvents.value = []
    }

    function removeLoading(id: string, auto?: boolean) {
      loadEvents.value = loadEvents.value.filter(l => {
        if (l.id === id) {
          if (auto) {
            console.error('超时！')
          } else if (l.timer) {
            clearTimeout(l.timer)
          }
          return false
        } else {
          return true
        }
      })
    }

    return {
      loadEvents
    }
  },
  render() {
    return (
      <>
        <Teleport to="body">
          {this.loadEvents.length > 0 ? (
            <div class="m-loading">
              <div class="m-loading-chase">
                <div class="m-loading-chase-dot"></div>
                <div class="m-loading-chase-dot"></div>
                <div class="m-loading-chase-dot"></div>
                <div class="m-loading-chase-dot"></div>
                <div class="m-loading-chase-dot"></div>
                <div class="m-loading-chase-dot"></div>
              </div>
            </div>
          ) : (
            ''
          )}
        </Teleport>
        {this.$slots.default?.()}
      </>
    )
  }
})
