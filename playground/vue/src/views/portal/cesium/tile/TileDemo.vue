<!--
 * @Author: zhouyinkui
 * @Date: 2024-01-08 13:48:50
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-08 13:54:17
 * @Description: 
-->
<template>
  <MapDemo>
    <template #demo>
      <TileCode></TileCode>
    </template>
    <template #code>
      <CodeDisplay :source="source"></CodeDisplay>
    </template>
  </MapDemo>
</template>

<script setup lang="ts">
import MapDemo from 'src/components/demo/MapDemo.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import TileCode from './TileCode.vue'
import Tile from './TileCode.vue?raw'

const source = [
  {
    label: 'TileCode',
    path: './TileCode.vue',
    raw: Tile
  }
]
</script>

<style scoped></style>
