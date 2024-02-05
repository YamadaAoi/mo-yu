<!--
 * @Author: zhouyinkui
 * @Date: 2024-02-04 10:16:32
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-02-04 17:12:31
 * @Description: 
-->
<template>
  <MapDemo>
    <template #demo>
      <TileStyleCode></TileStyleCode>
    </template>
    <template #code>
      <CodeDisplay :source="source"></CodeDisplay>
    </template>
  </MapDemo>
</template>

<script setup lang="ts">
import MapDemo from 'src/components/demo/MapDemo.vue'
import CodeDisplay from 'src/components/code/CodeDisplay.vue'
import TileStyleCode from './TileStyleCode.vue'
import TileStyle from './TileStyleCode.vue?raw'

const source = [
  {
    label: 'TileStyleCode',
    path: './TileStyleCode.vue',
    raw: TileStyle
  }
]
</script>

<style scoped></style>
