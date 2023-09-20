<!--
 * @Author: zhouyinkui
 * @Date: 2023-09-04 17:01:42
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-20 17:08:22
 * @Description:  
-->
<template>
  <demo-wrap>
    <template #title>数字动画 MAniNumber</template>
    <template #subTitle>你看这跳动的数字，像不像上次我借你的200块钱。</template>
    <template #demo>
      <AniNumberCode></AniNumberCode>
    </template>
    <template #code>
      <CodeDisplay :source="source"></CodeDisplay>
    </template>
  </demo-wrap>
</template>

<script setup lang="ts">
import DemoWrap from 'src/components/demo/DemoWrap.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import AniNumberCode from './AniNumberCode.vue'
import AniNumber from './AniNumberCode.vue?raw'

const source = [
  {
    label: 'AniNumberCode',
    path: './AniNumberCode.vue',
    raw: AniNumber
  }
]
</script>
