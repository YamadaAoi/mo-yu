<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-11 17:58:50
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-06 13:36:07
 * @Description:  
-->
<template>
  <demo-wrap>
    <template #demo>
      <highlight-code></highlight-code>
    </template>
    <template #code>
      <code-display :source="source"></code-display>
    </template>
  </demo-wrap>
</template>

<script setup lang="ts">
import DemoWrap from 'src/components/demo/DemoWrap.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import HighlightCode from './HighlightCode.vue'
import source from './HighlightCode.vue?raw'
</script>
