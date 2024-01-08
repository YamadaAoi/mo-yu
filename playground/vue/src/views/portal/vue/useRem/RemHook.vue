<!--
 * @Author: zhouyinkui
 * @Date: 2023-09-20 17:05:16
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-08 13:51:40
 * @Description: 
-->
<template>
  <DemoWrap>
    <template #title>RemHook useRem</template>
    <template #subTitle
      >显而易见，这就是为了在vue里方便使用remTool捣鼓出来的。</template
    >
    <template #demo>
      <RemHookCode></RemHookCode>
    </template>
    <template #code>
      <CodeDisplay :source="source"></CodeDisplay>
    </template>
  </DemoWrap>
</template>

<script setup lang="ts">
import DemoWrap from 'src/components/demo/DemoWrap.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import RemHookCode from './RemHookCode.vue'
import RemHook from './RemHookCode.vue?raw'

const source = [
  {
    label: 'RemHookCode',
    path: './RemHookCode.vue',
    raw: RemHook
  }
]
</script>
