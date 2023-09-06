<!--
 * @Author: zhouyinkui
 * @Date: 2023-09-06 16:11:14
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-06 16:24:02
 * @Description: 
-->
<template>
  <demo-wrap>
    <template #demo>
      <DragCode></DragCode>
    </template>
    <template #code>
      <code-display :source="source"></code-display>
    </template>
  </demo-wrap>
</template>

<script setup lang="ts">
import DemoWrap from 'src/components/demo/DemoWrap.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import DragCode from './DragCode.vue'
import source from './DragCode.vue?raw'
</script>

<style scoped></style>
