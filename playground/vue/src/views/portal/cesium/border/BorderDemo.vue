<!--
 * @Author: zhouyinkui
 * @Date: 2024-03-08 14:44:45
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-22 18:06:29
 * @Description: 
-->
<template>
  <MapDemo>
    <template #demo>
      <BorderCode></BorderCode>
    </template>
    <template #code>
      <CodeDisplay :source="source"></CodeDisplay>
    </template>
  </MapDemo>
</template>

<script setup lang="ts">
import MapDemo from 'src/components/demo/MapDemo.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import BorderCode from './BorderCode.vue'
import Border from './BorderCode.vue?raw'

const source = [
  {
    label: 'BorderCode',
    path: './BorderCode.vue',
    raw: Border
  }
]
</script>

<style scoped></style>
