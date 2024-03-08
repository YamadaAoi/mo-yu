<!--
 * @Author: zhouyinkui
 * @Date: 2024-03-08 15:37:31
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-08 15:37:34
 * @Description: 
-->
<template>
  <MapDemo>
    <template #demo>
      <PointsCode></PointsCode>
    </template>
    <template #code>
      <CodeDisplay :source="source"></CodeDisplay>
    </template>
  </MapDemo>
</template>

<script setup lang="ts">
import MapDemo from 'src/components/demo/MapDemo.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import PointsCode from './PointsCode.vue'
import Points from './PointsCode.vue?raw'

const source = [
  {
    label: 'PointsCode',
    path: './PointsCode.vue',
    raw: Points
  }
]
</script>

<style scoped></style>
