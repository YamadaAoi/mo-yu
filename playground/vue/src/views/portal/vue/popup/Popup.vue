<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-10 16:42:07
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-06 13:36:28
 * @Description:
-->
<template>
  <demo-wrap>
    <template #demo>
      <popup-code></popup-code>
    </template>
    <template #code>
      <code-display :source="source"></code-display>
    </template>
  </demo-wrap>
</template>

<script setup lang="ts">
import DemoWrap from 'src/components/demo/DemoWrap.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import PopupCode from './PopupCode.vue'
import source from './PopupCode.vue?raw'
</script>
