<!--
 * @Author: zhouyinkui
 * @Date: 2024-03-08 14:44:23
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-22 18:26:29
 * @Description: 简单自定义材质线，支持颜色和图片
-->
<template>
  <div class="fly-wrap">
    <CommonMap @loaded="onLoaded" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { MapFlyTool } from '@mo-yu/cesium'
import CommonMap from '../map/CommonMap.vue'

const mapReady = ref(false)
let tool: MapFlyTool

onBeforeUnmount(() => {
  tool?.destroy()
})

function onLoaded() {
  mapReady.value = true
  tool = new MapFlyTool({})
  tool.enable()
  tool.eventBus.on('time-change', e => {
    console.log(e.sceonds)
  })
  tool.initRoute(
    [
      {
        heading: 356.593704902111,
        pitch: -21.448515521042953,
        roll: 0.007733530122709404,
        lng: 119.66762845212162,
        lat: 35.402470203941334,
        height: 10971.219144344364
      },
      {
        heading: 356.5937049021109,
        pitch: -21.4485155210421,
        roll: 0.007733530122709404,
        lng: 119.65031090040581,
        lat: 35.57342348251242,
        height: 2569.2103545477744,
        duration: 4
      },
      {
        heading: 356.59370715889673,
        pitch: -21.448419012039388,
        roll: 0.007727358379704657,
        lng: 119.64746745260679,
        lat: 35.617702721104834,
        height: 2584.811856533926,
        duration: 4
      },
      {
        heading: 356.59370715889656,
        pitch: -21.448419012039363,
        roll: 0.007727358379195768,
        lng: 119.64160165632718,
        lat: 35.66958038673165,
        height: 614.7256452936394,
        duration: 4
      },
      {
        heading: 356.59370715889645,
        pitch: -21.448419012039363,
        roll: 0.007727358378992213,
        lng: 119.64081228608511,
        lat: 35.67462576105157,
        height: 331.1554288493723,
        duration: 1
      }
    ],
    true
  )
  setTimeout(() => {
    tool?.play()
  }, 2000)
}
</script>

<style scoped lang="scss">
.fly-wrap {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
