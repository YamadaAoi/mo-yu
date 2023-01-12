<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-11 18:04:57
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-12 10:37:00
 * @Description: 
 * Copyright (c) 2023 by piesat, All Rights Reserved. 
-->
<template>
  <n-input
    v-model:value="val"
    type="text"
    placeholder="输入关键字检索"
  ></n-input>
  <m-highlight :word="val" text="或许我不是人，但你是真的狗。"></m-highlight>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NInput } from 'naive-ui'
import { MHighlight } from '@mo-yu/vue'

const val = ref('')
</script>
