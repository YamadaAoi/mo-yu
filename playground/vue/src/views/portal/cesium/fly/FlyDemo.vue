<!--
 * @Author: zhouyinkui
 * @Date: 2024-03-08 14:44:45
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-22 18:12:29
 * @Description: 
-->
<template>
  <MapDemo>
    <template #demo>
      <FlyCode></FlyCode>
    </template>
    <template #code>
      <CodeDisplay :source="source"></CodeDisplay>
    </template>
  </MapDemo>
</template>

<script setup lang="ts">
import MapDemo from 'src/components/demo/MapDemo.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import FlyCode from './FlyCode.vue'
import Fly from './FlyCode.vue?raw'

const source = [
  {
    label: 'FlyCode',
    path: './FlyCode.vue',
    raw: Fly
  }
]
</script>

<style scoped></style>
