<!--
 * @Author: zhouyinkui
 * @Date: 2023-09-20 17:05:33
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-20 17:17:52
 * @Description: remTool hook代码示例
-->
<template>
  <div></div>
</template>

<script setup lang="ts">
import { useRem } from '@mo-yu/vue'

// 需要先启用remTool.enable()
const { rem, zoom, remToPx } = useRem()

console.log(rem.value)
console.log(zoom.value)
console.log('1rem=', remToPx(1))
</script>

<style scoped></style>
