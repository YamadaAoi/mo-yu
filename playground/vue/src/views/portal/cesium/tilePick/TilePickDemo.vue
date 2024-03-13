<!--
 * @Author: zhouyinkui
 * @Date: 2024-03-13 17:30:21
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-13 17:33:16
 * @Description: 
-->
<template>
  <MapDemo>
    <template #demo>
      <TilePickCode></TilePickCode>
    </template>
    <template #code>
      <CodeDisplay :source="source"></CodeDisplay>
    </template>
  </MapDemo>
</template>

<script setup lang="ts">
import MapDemo from 'src/components/demo/MapDemo.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import TilePickCode from './TilePickCode.vue'
import TilePick from './TilePickCode.vue?raw'

const source = [
  {
    label: 'TilePickCode',
    path: './TilePickCode.vue',
    raw: TilePick
  }
]
</script>

<style scoped></style>
