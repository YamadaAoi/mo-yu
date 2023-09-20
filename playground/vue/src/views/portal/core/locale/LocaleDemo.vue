<!--
 * @Author: zhouyinkui
 * @Date: 2023-09-20 11:22:43
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-20 17:08:02
 * @Description: 
-->
<template>
  <demo-wrap>
    <template #title>国际化工具 LocaleTool</template>
    <template #subTitle>这活儿要不还是让后端干吧。</template>
    <template #demo>
      <LocaleCode></LocaleCode>
    </template>
    <template #code>
      <CodeDisplay :source="source"></CodeDisplay>
    </template>
  </demo-wrap>
</template>

<script setup lang="ts">
import DemoWrap from 'src/components/demo/DemoWrap.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import LocaleCode from './LocaleCode.vue'
import Locale from './LocaleCode.vue?raw'
import enUs from './config/en_us?raw'
import zhCn from './config/zh_cn?raw'

const source = [
  {
    label: 'LocaleCode',
    path: './LocaleCode.vue',
    raw: Locale
  },
  {
    label: 'en_us',
    path: './config/en_us',
    raw: enUs
  },
  {
    label: 'zh_cn',
    path: './config/zh_cn',
    raw: zhCn
  }
]
</script>

<style scoped></style>
