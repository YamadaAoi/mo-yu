<!--
 * @Author: zhouyinkui
 * @Date: 2023-09-04 17:01:42
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-04 17:03:44
 * @Description: 
 * Copyright (c) 2023 by piesat, All Rights Reserved. 
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
import DemoWrap from '../../../components/demo/DemoWrap.vue'
import CodeDisplay from '../../../components/code/CodeDisplay.vue'
import AniNumberCode from './AniNumberCode.vue'
import source from './AniNumberCode.vue?raw'
</script>
