<!--
 * @Author: zhouyinkui
 * @Date: 2024-01-08 14:21:09
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-12 11:28:53
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
import json from './mainMapView.json?raw'

const source = [
  {
    label: 'CommonMap',
    path: './CommonMap.vue',
    raw: map
  },
  {
    label: 'mainMapView',
    path: '/map/mainMapView.json',
    raw: json
  }
]
</script>

<style scoped></style>
