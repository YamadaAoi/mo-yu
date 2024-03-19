<!--
 * @Author: zhouyinkui
 * @Date: 2024-03-13 17:30:12
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-19 19:37:09
 * @Description: shp生成的白膜图层选中交互
-->
<template>
  <div class="tile-pick">
    <CommonMap @loaded="onLoaded" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { MapTileTool } from '@mo-yu/cesium'
import CommonMap from '../map/CommonMap.vue'

const mapReady = ref(false)
let tool: MapTileTool

onBeforeUnmount(() => {
  tool?.destroy()
})

function onLoaded() {
  mapReady.value = true
  tool = new MapTileTool({})
  tool.enable()
  tool.eventBus.on('pick-fea', e => {
    console.log(e.properties)
  })
  tool.add3DTileset({
    url: 'https://nync.piesat.cn/oss/qingdao/jianzhu/tileset.json',
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
