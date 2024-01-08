<!--
 * @Author: zhouyinkui
 * @Date: 2023-09-11 11:13:21
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-08 13:52:16
 * @Description: 
-->
<template>
  <DemoWrap>
    <template #title>适配工具 remTool</template>
    <template #subTitle>搭配 postcss-pxtorem，让适配工作少一点。</template>
    <template #code>
      <CodeDisplay :source="source"></CodeDisplay>
    </template>
  </DemoWrap>
</template>

<script setup lang="ts">
import DemoWrap from 'src/components/demo/DemoWrap.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import remCode from './remCode?raw'

const source = [
  {
    label: 'remCode',
    path: './remCode',
    raw: remCode
  }
]
</script>

<style scoped></style>
