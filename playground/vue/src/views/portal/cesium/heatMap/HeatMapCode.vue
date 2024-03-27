<!--
 * @Author: zhouyinkui
 * @Date: 2024-02-04 10:16:16
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-27 14:05:32
 * @Description: shp生成的白膜图层根据属性设置样式
-->
<template>
  <div class="heat-map">
    <CommonMap @loaded="onLoaded" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { HeatMapTool } from '@mo-yu/cesium'
import CommonMap from '../map/CommonMap.vue'

const mapReady = ref(false)
let tool: HeatMapTool

onBeforeUnmount(() => {
  tool?.destroy()
})

function onLoaded() {
  mapReady.value = true
  tool = new HeatMapTool({})
  tool.enable()
  tool.addHeatMap({
    url: '/data/shb_rlt.json',
    id: 'shb_rlt',
    bounds: [
      119.6425524635932049, 35.6810169027287998, 119.6859526485574605,
      35.7180477772716785
    ],
    defaultValue: 1,
    min: 0,
    minheight: 300,
    height: 50,
    heatmapjs: {
      radius: 100,
      maxOpacity: 1,
      minOpacity: 0.1,
      blur: 0.85,
      gradient: {
        '.3': 'rgb(88,181,189)',
        '.45': 'rgb(132,214,167)',
        '.65': 'rgb(235,225,150)',
        '.8': 'rgb(239,107,75)',
        '.95': 'rgb(205,29,74)'
      }
    }
  })
}
</script>

<style scoped lang="scss">
.heat-map {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
