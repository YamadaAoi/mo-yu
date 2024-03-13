/*
 * @Author: zhouyinkui
 * @Date: 2024-03-13 15:37:18
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-13 16:19:33
 * @Description: 自动滚动
 */
import './scroll.scss'
import { defineComponent, h, onMounted, nextTick } from 'vue'
import { guid } from '@mo-yu/core'

/**
 * 自动滚动
 * interval：AnimationFrame时间间隔，单位毫秒
 * @example
 * ```html
 * <m-scroll :interval="100">
 *   {{ someText }}
 * </m-scroll>
 * ```
 */
export default defineComponent({
  name: 'MScroll',
  props: {
    interval: {
      type: Number,
      required: false,
      default: 100
    }
  },
  setup(props, { expose }) {
    const eleId = `m-scroll-${guid()}`
    let timer: number | null = null
    let lastTime = 0

    onMounted(() => {
      startScroll()
    })

    expose({ startScroll, stopScroll })

    function startScroll() {
      nextTick()
        .then(() => {
          lastTime = Date.now()
          doScroll()
        })
        .catch(err => {
          console.error(err)
        })
    }

    function stopScroll() {
      if (timer !== null) {
        cancelAnimationFrame(timer)
        timer = null
      }
    }

    function doScroll() {
      const ele = document.getElementById(eleId)
      if (ele) {
        const needScroll = ele.scrollHeight - ele.offsetHeight
        if (needScroll > 0) {
          const now = Date.now()
          const elapsed = now - lastTime
          if (elapsed >= props.interval) {
            lastTime = now - (elapsed % props.interval)
            if (ele.scrollTop < needScroll) {
              ele.scrollTop += 1
            } else {
              ele.scrollTop = 0
            }
          }
        }
        timer = requestAnimationFrame(doScroll)
      }
    }

    return {
      eleId,
      startScroll,
      stopScroll
    }
  },
  render() {
    return (
      <div
        id={this.eleId}
        class="m-scroll"
        onMouseenter={this.stopScroll}
        onMouseleave={this.startScroll}>
        {this.$slots.default?.()}
      </div>
    )
  }
})
