<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-10 16:42:07
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-12 10:46:12
 * @Description:
 * Copyright (c) 2023 by piesat, All Rights Reserved.
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
import DemoWrap from '../../../components/demo/DemoWrap.vue'
import CodeDisplay from '../../../components/code/CodeDisplay.vue'
import PopupCode from './PopupCode.vue'
import source from './PopupCode.vue?raw'
</script>
