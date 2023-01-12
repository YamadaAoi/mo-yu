<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-11 17:58:50
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-12 09:05:58
 * @Description: 
 * Copyright (c) 2023 by piesat, All Rights Reserved. 
-->
<template>
  <demo-wrap>
    <template #demo>
      <n-input
        v-model:value="val"
        type="text"
        placeholder="输入关键字检索"
      ></n-input>
      <m-highlight
        :word="val"
        text="或许我不是人，但你是真的狗。"
      ></m-highlight>
    </template>
    <template #code>
      <highlight-code></highlight-code>
    </template>
  </demo-wrap>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NInput } from 'naive-ui'
import { MHighlight } from '@mo-yu/vue'
import DemoWrap from '../../../components/demo/DemoWrap.vue'
import HighlightCode from './HighlightCode'

const val = ref('')
</script>
