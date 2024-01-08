<!--
 * @Author: zhouyinkui
 * @Date: 2024-01-08 14:21:09
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-08 14:22:38
 * @Description: 
-->
<template>
  <MapDemo>
    <template #demo>
      <CommonMap></CommonMap>
    </template>
    <template #code>
      <CodeDisplay :source="source"></CodeDisplay>
    </template>
  </MapDemo>
</template>

<script setup lang="ts">
import MapDemo from 'src/components/demo/MapDemo.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import CommonMap from './CommonMap.vue'
import map from './CommonMap.vue?raw'

const source = [
  {
    label: 'CommonMap',
    path: './CommonMap.vue',
    raw: map
  }
]
</script>

<style scoped></style>
