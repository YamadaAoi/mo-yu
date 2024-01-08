<!--
 * @Author: zhouyinkui
 * @Date: 2024-01-08 14:17:31
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-08 14:17:31
 * @Description: 
-->
<template>
  <MapDemo>
    <template #demo>
      <DrawCode></DrawCode>
    </template>
    <template #code>
      <CodeDisplay :source="source"></CodeDisplay>
    </template>
  </MapDemo>
</template>

<script setup lang="ts">
import MapDemo from 'src/components/demo/MapDemo.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import DrawCode from './DrawCode.vue'
import draw from './DrawCode.vue?raw'

const source = [
  {
    label: 'DrawCode',
    path: './DrawCode.vue',
    raw: draw
  }
]
</script>

<style scoped></style>
