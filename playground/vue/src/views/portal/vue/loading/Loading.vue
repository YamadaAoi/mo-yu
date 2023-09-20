<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-11 16:38:30
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-20 17:08:52
 * @Description:  
-->
<template>
  <demo-wrap>
    <template #title>等待遮罩 MLoading</template>
    <template #subTitle>双手抱头，不准动。</template>
    <template #demo>
      <LoadingCode></LoadingCode>
    </template>
    <template #code>
      <CodeDisplay :source="source"></CodeDisplay>
    </template>
  </demo-wrap>
</template>

<script setup lang="ts">
import DemoWrap from 'src/components/demo/DemoWrap.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import LoadingCode from './LoadingCode.vue'
import Loading from './LoadingCode.vue?raw'

const source = [
  {
    label: 'LoadingCode',
    path: './LoadingCode.vue',
    raw: Loading
  }
]
</script>
