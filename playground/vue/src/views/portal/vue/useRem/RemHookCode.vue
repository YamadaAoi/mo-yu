<!--
 * @Author: zhouyinkui
 * @Date: 2023-09-20 17:05:33
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-12-04 10:07:24
 * @Description: remTool hook代码示例
-->
<template>
  <div></div>
</template>

<script setup lang="ts">
import { useRem } from '@mo-yu/vue'

// 需要先启用remTool.enable()
const { rem, remToPx } = useRem()

console.log(rem.value)
console.log('1rem=', remToPx(1))
</script>

<style scoped></style>
