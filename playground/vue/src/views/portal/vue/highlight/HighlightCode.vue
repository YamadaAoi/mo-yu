<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-11 18:04:57
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-06 17:03:19
 * @Description: 高亮关键字代码示例
-->
<template>
  <NInput
    v-model:value="val"
    type="text"
    size="small"
    placeholder="输入关键字检索"
  ></NInput>
  <MHighlight :word="val" text="我练功发自真心"></MHighlight>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NInput } from 'naive-ui'
import { MHighlight } from '@mo-yu/vue'

const val = ref('')
</script>
