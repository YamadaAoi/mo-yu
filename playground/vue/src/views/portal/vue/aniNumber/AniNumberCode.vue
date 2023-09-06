<!--
 * @Author: zhouyinkui
 * @Date: 2023-09-04 17:02:01
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-06 16:24:21
 * @Description: 数字动画代码示例
-->
<template>
  <div>
    <MAniNumber :value="val1"></MAniNumber>
    <br />
    <MAniNumber :value="val2"></MAniNumber>
    <br />
    <MAniNumber :value="val3"></MAniNumber>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MAniNumber } from '@mo-yu/vue'

const val1 = 233.333
const val2 = ref<number | undefined>(233.333)
const val3 = ref(233.333)

onMounted(() => {
  setTimeout(() => {
    val2.value = undefined
    val3.value = 3.1415926
  }, 1000)
})
</script>
