<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-11 16:38:30
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-12 10:42:51
 * @Description: 
 * Copyright (c) 2023 by piesat, All Rights Reserved. 
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
import DemoWrap from '../../../components/demo/DemoWrap.vue'
import CodeDisplay from '../../../components/code/CodeDisplay.vue'
import LoadingCode from './LoadingCode.vue'
import source from './LoadingCode.vue?raw'
</script>
