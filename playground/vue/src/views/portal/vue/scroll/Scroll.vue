<!--
 * @Author: zhouyinkui
 * @Date: 2024-03-13 16:03:31
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-13 16:10:37
 * @Description: 
-->
<template>
  <DemoWrap>
    <template #title>简单滚动 MScroll</template>
    <template #subTitle>不动起来总感觉少了些什么。</template>
    <template #demo>
      <ScrollCode></ScrollCode>
    </template>
    <template #code>
      <CodeDisplay :source="source"></CodeDisplay>
    </template>
  </DemoWrap>
</template>

<script setup lang="ts">
import DemoWrap from 'src/components/demo/DemoWrap.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import ScrollCode from './ScrollCode.vue'
import Scroll from './ScrollCode.vue?raw'

const source = [
  {
    label: 'ScrollCode',
    path: './ScrollCode.vue',
    raw: Scroll
  }
]
</script>
