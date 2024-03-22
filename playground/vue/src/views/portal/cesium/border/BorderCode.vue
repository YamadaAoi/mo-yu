<!--
 * @Author: zhouyinkui
 * @Date: 2024-03-08 14:44:23
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-22 18:09:57
 * @Description: 简单自定义材质线，支持颜色和图片
-->
<template>
  <div class="border-wrap">
    <CommonMap @loaded="onLoaded" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { MapGeoTool } from '@mo-yu/cesium'
import CommonMap from '../map/CommonMap.vue'

const mapReady = ref(false)
let tool: MapGeoTool

onBeforeUnmount(() => {
  tool?.destroy()
})

function onLoaded() {
  mapReady.value = true
  tool = new MapGeoTool({})
  tool.enable()
  tool.eventBus.on('pick-fea-all', e => {
    console.log(e.properties)
  })
  tool.addGeo({
    url: '/data/dachang.json',
    id: 'dcz_czbj',
    fill: 'rgba(0,0,0,0)',
    clampToGround: true,
    custom: {
      border: {
        style: {
          width: 6,
          clampToGround: true,
          customMaterial: {
            flow: {
              vertical: false,
              speed: 0.5,
              colors: [
                'rgba(255, 206, 0, 1)',
                'rgba(0, 255, 255, 1)',
                'rgba(255, 206, 0, 1)',
                'rgba(76, 245, 250, 1)'
              ]
            }
          },
          customDepthFailMaterial: {
            flow: {
              vertical: false,
              speed: 0.5,
              colors: [
                'rgba(255, 206, 0, 1)',
                'rgba(0, 255, 255, 1)',
                'rgba(255, 206, 0, 1)',
                'rgba(76, 245, 250, 1)'
              ]
            }
          }
        }
      }
    }
  })
}
</script>

<style scoped lang="scss">
.border-wrap {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
