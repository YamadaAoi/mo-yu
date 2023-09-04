<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-11 18:04:57
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-04 17:22:08
 * @Description: 高亮关键字代码示例
-->
<template>
  <n-input
    v-model:value="val"
    type="text"
    placeholder="输入关键字检索"
  ></n-input>
  <m-highlight :word="val" text="我练功发自真心"></m-highlight>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NInput } from 'naive-ui'
import { MHighlight } from '@mo-yu/vue'

const val = ref('')
</script>
