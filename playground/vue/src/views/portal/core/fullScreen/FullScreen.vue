<!--
 * @Author: zhouyinkui
 * @Date: 2023-09-06 15:16:08
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-06 15:31:30
 * @Description: 
-->
<template>
  <demo-wrap>
    <template #demo>
      <FullScreenCode></FullScreenCode>
    </template>
    <template #code>
      <code-display :source="source"></code-display>
    </template>
  </demo-wrap>
</template>

<script setup lang="ts">
import DemoWrap from 'src/components/demo/DemoWrap.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import FullScreenCode from './FullScreenCode.vue'
import source from './FullScreenCode.vue?raw'
</script>

<style scoped></style>
