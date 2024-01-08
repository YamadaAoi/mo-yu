<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-10 16:42:07
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-08 13:51:52
 * @Description:
-->
<template>
  <DemoWrap>
    <template #title>拖拽弹框 MPopup</template>
    <template #subTitle>你不要这样，我是个有原则的弹框。</template>
    <template #demo>
      <PopupCode></PopupCode>
    </template>
    <template #code>
      <CodeDisplay :source="source"></CodeDisplay>
    </template>
  </DemoWrap>
</template>

<script setup lang="ts">
import DemoWrap from 'src/components/demo/DemoWrap.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import PopupCode from './PopupCode.vue'
import Popup from './PopupCode.vue?raw'

const source = [
  {
    label: 'PopupCode',
    path: './PopupCode.vue',
    raw: Popup
  }
]
</script>
