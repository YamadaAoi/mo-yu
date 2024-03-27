<!--
 * @Author: zhouyinkui
 * @Date: 2024-02-04 10:16:32
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-27 13:59:14
 * @Description: 
-->
<template>
  <MapDemo>
    <template #demo>
      <HeatMapCode></HeatMapCode>
    </template>
    <template #code>
      <CodeDisplay :source="source"></CodeDisplay>
    </template>
  </MapDemo>
</template>

<script setup lang="ts">
import MapDemo from 'src/components/demo/MapDemo.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import HeatMapCode from './HeatMapCode.vue'
import HeatMap from './HeatMapCode.vue?raw'

const source = [
  {
    label: 'HeatMapCode',
    path: './HeatMapCode.vue',
    raw: HeatMap
  }
]
</script>

<style scoped></style>
