<!--
 * @Author: zhouyinkui
 * @Date: 2023-09-06 15:16:08
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-08 13:52:34
 * @Description: 
-->
<template>
  <DemoWrap>
    <template #title>全屏工具 FullscreenTool</template>
    <template #subTitle>快，让我康康。</template>
    <template #demo>
      <FullScreenCode></FullScreenCode>
    </template>
    <template #code>
      <CodeDisplay :source="source"></CodeDisplay>
    </template>
  </DemoWrap>
</template>

<script setup lang="ts">
import DemoWrap from 'src/components/demo/DemoWrap.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import FullScreenCode from './FullScreenCode.vue'
import FullScreen from './FullScreenCode.vue?raw'

const source = [
  {
    label: 'FullScreenCode',
    path: './FullScreenCode.vue',
    raw: FullScreen
  }
]
</script>

<style scoped></style>
