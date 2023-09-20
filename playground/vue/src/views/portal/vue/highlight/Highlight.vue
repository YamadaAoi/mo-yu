<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-11 17:58:50
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-20 17:08:39
 * @Description:  
-->
<template>
  <demo-wrap>
    <template #title>高亮关键字 MHighlight</template>
    <template #subTitle>别躲了，我看见你了，出来吧。</template>
    <template #demo>
      <HighlightCode></HighlightCode>
    </template>
    <template #code>
      <CodeDisplay :source="source"></CodeDisplay>
    </template>
  </demo-wrap>
</template>

<script setup lang="ts">
import DemoWrap from 'src/components/demo/DemoWrap.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import HighlightCode from './HighlightCode.vue'
import Highlight from './HighlightCode.vue?raw'

const source = [
  {
    label: 'HighlightCode',
    path: './HighlightCode.vue',
    raw: Highlight
  }
]
</script>
