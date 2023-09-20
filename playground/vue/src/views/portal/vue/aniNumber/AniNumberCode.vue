<!--
 * @Author: zhouyinkui
 * @Date: 2023-09-04 17:02:01
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-20 11:01:23
 * @Description: 数字动画代码示例
-->
<template>
  <div>
    ￥<MAniNumber :value="val1"></MAniNumber>
    <br />
    ￥<MAniNumber :value="val2"></MAniNumber>
    <br />
    ￥<MAniNumber :value="val3"></MAniNumber>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MAniNumber } from '@mo-yu/vue'

const val1 = 200.0
const val2 = ref<number | undefined>(200.0)
const val3 = ref(200.0)

onMounted(() => {
  setTimeout(() => {
    val2.value = undefined
    val3.value = 233.33
  }, 1000)
})
</script>
