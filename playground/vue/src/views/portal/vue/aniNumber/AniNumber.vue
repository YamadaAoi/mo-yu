<!--
 * @Author: zhouyinkui
 * @Date: 2023-09-04 17:01:42
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-06 13:35:53
 * @Description:  
-->
<template>
  <demo-wrap>
    <template #demo>
      <ani-number-code></ani-number-code>
    </template>
    <template #code>
      <code-display :source="source"></code-display>
    </template>
  </demo-wrap>
</template>

<script setup lang="ts">
import DemoWrap from 'src/components/demo/DemoWrap.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import AniNumberCode from './AniNumberCode.vue'
import source from './AniNumberCode.vue?raw'
</script>
