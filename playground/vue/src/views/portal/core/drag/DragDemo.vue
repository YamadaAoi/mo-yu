<!--
 * @Author: zhouyinkui
 * @Date: 2023-09-06 16:11:14
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-08 13:52:40
 * @Description: 
-->
<template>
  <DemoWrap>
    <template #title>拖拽工具 DragTool</template>
    <template #subTitle>我是一块砖，哪里需要往哪儿搬。</template>
    <template #demo>
      <DragCode></DragCode>
    </template>
    <template #code>
      <CodeDisplay :source="source"></CodeDisplay>
    </template>
  </DemoWrap>
</template>

<script setup lang="ts">
import DemoWrap from 'src/components/demo/DemoWrap.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import DragCode from './DragCode.vue'
import Drag from './DragCode.vue?raw'

const source = [
  {
    label: 'DragCode',
    path: './DragCode.vue',
    raw: Drag
  }
]
</script>

<style scoped></style>
