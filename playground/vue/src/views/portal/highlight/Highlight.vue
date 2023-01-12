<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-11 17:58:50
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-12 10:43:52
 * @Description: 
 * Copyright (c) 2023 by piesat, All Rights Reserved. 
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
import DemoWrap from '../../../components/demo/DemoWrap.vue'
import CodeDisplay from '../../../components/code/CodeDisplay.vue'
import HighlightCode from './HighlightCode.vue'
import source from './HighlightCode.vue?raw'
</script>
