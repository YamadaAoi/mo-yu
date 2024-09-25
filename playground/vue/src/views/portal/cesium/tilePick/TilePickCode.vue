<!--
 * @Author: zhouyinkui
 * @Date: 2024-03-13 17:30:12
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-09-25 17:37:20
 * @Description: shp生成的白膜图层选中交互
-->
<template>
  <div class="tile-pick">
    <CommonMap @loaded="onLoaded" />
  </div>
</template>

<script setup lang="ts">
import { mapStoreTool } from '@mo-yu/cesium'
import CommonMap from '../map/CommonMap.vue'

function onLoaded() {
  const map = mapStoreTool.getMap()
  map.sceneTool.eventBus.on('pick-all', e => {
    console.log(e.properties)
  })
  map.sceneTool.tile.add3DTileset({
    url: 'http://121.40.254.67:8001/tiles/jianzhu/tileset.json',
    id: 'jianzhu',
    locate: true,
    style: {
      colorAll: 'rgba(255,255,255,0.4)'
    },
    pick: {
      hover: { color: 'green' },
      click: { color: 'yellow' }
    }
  })
}
</script>

<style scoped lang="scss">
.tile-pick {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
