<!--
 * @Author: zhouyinkui
 * @Date: 2024-03-08 15:33:03
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-09-18 17:17:20
 * @Description: 多点聚合
-->
<template>
  <div class="border-wrap">
    <CommonMap @loaded="onLoaded" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { PointsTool } from '@mo-yu/cesium'
import CommonMap from '../map/CommonMap.vue'

const mapReady = ref(false)
let tool: PointsTool

onBeforeUnmount(() => {
  tool?.destroy()
})

function onLoaded() {
  mapReady.value = true
  tool = new PointsTool({})
  tool.enable()
  tool.addPoints({
    url: '/data/points.json',
    id: 'video',
    custom: {
      billboard: {
        style: {
          image: '/images/video.png',
          horizontalOrigin: 0,
          verticalOrigin: 1,
          disableDepthTestDistance: 999999999
        },
        cluster: {
          options: {
            enabled: true,
            minimumClusterSize: 3,
            pixelRange: 50
          },
          label: {
            show: true,
            heightReference: 1,
            disableDepthTestDistance: 999999999,
            horizontalOrigin: 0,
            verticalOrigin: 1,
            pixelOffset: [0, -36],
            font: '24px sans-serif'
          },
          billboard: {
            show: true,
            image: '/images/camera.png',
            heightReference: 1,
            disableDepthTestDistance: 999999999
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
