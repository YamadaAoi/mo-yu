<!--
 * @Author: zhouyinkui
 * @Date: 2024-03-08 14:44:45
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-22 17:55:12
 * @Description: 
-->
<template>
  <MapDemo>
    <template #demo>
      <WallCode></WallCode>
    </template>
    <template #code>
      <CodeDisplay :source="source"></CodeDisplay>
    </template>
  </MapDemo>
</template>

<script setup lang="ts">
import MapDemo from 'src/components/demo/MapDemo.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import WallCode from './WallCode.vue'
import Wall from './WallCode.vue?raw'

const source = [
  {
    label: 'WallCode',
    path: './WallCode.vue',
    raw: Wall
  }
]
</script>

<style scoped></style>
