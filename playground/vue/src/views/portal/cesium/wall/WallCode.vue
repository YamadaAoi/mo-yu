<!--
 * @Author: zhouyinkui
 * @Date: 2024-03-08 14:44:23
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-09-25 17:35:24
 * @Description: 简单自定义材质墙，支持颜色和图片
-->
<template>
  <div class="wall-wrap">
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
  map.sceneTool.geo.addGeo({
    url: '/data/dachang.json',
    id: 'dcz_czbj',
    fill: 'rgba(0,0,0,0)',
    clampToGround: true,
    custom: {
      wall: {
        style: {
          customMaterial: {
            flow: {
              vertical: true,
              speed: 4,
              colors: [
                'rgba(0,248,255,0.1)',
                'rgba(0,248,255,0.8)',
                'rgba(0,248,255,0.1)'
              ]
            }
          },
          maximumHeights: 200,
          distanceDisplayCondition: [0, 35000]
        }
      },
      label: {
        style: {
          field: 'name',
          fillColor: '#fff',
          font: 'normal 20px MicroSoft YaHei',
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          distanceDisplayCondition: [0, 35000]
        }
      }
    }
  })
}
</script>

<style scoped lang="scss">
.wall-wrap {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
