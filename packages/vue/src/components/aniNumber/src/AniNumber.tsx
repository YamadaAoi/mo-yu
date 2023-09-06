/*
 * @Author: zhouyinkui
 * @Date: 2023-09-04 15:16:14
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-06 14:55:37
 * @Description: 从0到任意数值的动画
 */
import {
  defineComponent,
  onMounted,
  ref,
  watchEffect,
  type PropType
} from 'vue'
import { isNumber } from '@mo-yu/core'

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 5)
}

/**
 * 从0到任意数值的动画（参考“naive-ui” # NumberAnimation的简易版本）
 * @example
 * ```html
 * <m-ani-number :value="233.333"></m-ani-number>
 * ```
 */
export default defineComponent({
  name: 'MAniNumber',
  props: {
    value: { type: Number, default: 0 },
    precision: { type: Number },
    active: { type: Boolean, default: true },
    duration: { type: Number, default: 2000 },
    onFinish: Function as PropType<() => void>
  },
  setup(props) {
    let raf: number
    const to = ref(0)
    const precision = ref(0)
    const displayedValueRef = ref(0)

    onMounted(() => {
      watchEffect(() => {
        animate()
      })
    })

    function animate() {
      if (undefined !== raf) {
        cancelAnimationFrame(raf)
      }
      displayedValueRef.value = 0
      if (isNumber(props.value)) {
        if (props.precision === undefined) {
          const valueStr = `${props.value}`
          if (valueStr.includes('.')) {
            precision.value = valueStr.length - 1 - valueStr.indexOf('.')
          } else {
            precision.value = 0
          }
        } else {
          precision.value = props.precision
        }
        to.value = Number(props.value)
      } else {
        to.value = 0
      }
      if (to.value !== 0 && props.active) {
        tween(to.value, props.duration)
      }
    }

    function tween(to: number, duration: number) {
      function tick() {
        const current = performance.now()
        const elapsedTime = Math.min(current - startTime, duration)
        const currentValue = to * easeOut(elapsedTime / duration)
        if (elapsedTime === duration) {
          displayedValueRef.value = to
          props.onFinish?.()
          return
        }
        displayedValueRef.value = currentValue
        raf = requestAnimationFrame(tick)
      }
      const startTime = performance.now()
      tick()
    }

    return {
      displayedValue: displayedValueRef,
      precision
    }
  },
  render() {
    return this.displayedValue.toFixed(this.precision)
  }
})
