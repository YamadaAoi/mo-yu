<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-11 16:38:30
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-06 13:36:14
 * @Description:  
-->
<template>
  <demo-wrap>
    <template #demo>
      <loading-code></loading-code>
    </template>
    <template #code>
      <code-display :source="source"></code-display>
    </template>
  </demo-wrap>
</template>

<script setup lang="ts">
import DemoWrap from 'src/components/demo/DemoWrap.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import LoadingCode from './LoadingCode.vue'
import source from './LoadingCode.vue?raw'
</script>
