<!--
 * @Author: zhouyinkui
 * @Date: 2024-01-03 09:46:03
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-04 18:59:32
 * @Description: 绘制工具
-->
<template>
  <div class="draw-tool">
    <CommonMap @loaded="onLoaded" />
    <div v-if="mapReady" class="data-tool">
      <NPopover placement="bottom" trigger="click" :show-arrow="false">
        <template #trigger>
          <div class="tool iconfont icon-huizhi" title="圈画"></div>
        </template>
        <div class="tool-pop">
          <div
            class="map-tool iconfont icon-quandian"
            title="画点"
            @click="startPoint"
          ></div>
          <div
            class="map-tool iconfont icon-huaxian"
            title="画线"
            @click="startPolyline"
          ></div>
          <div
            class="map-tool iconfont icon-quandian1"
            title="画圈"
            @click="startCircle"
          ></div>
          <div
            class="map-tool iconfont icon-kuang"
            title="画框"
            @click="startRect"
          ></div>
          <div
            class="map-tool iconfont icon-duobianxingxuanze"
            title="画多边形"
            @click="startPolygon"
          ></div>
        </div>
      </NPopover>
      <NPopover placement="bottom" trigger="click" :show-arrow="false">
        <template #trigger>
          <div class="tool iconfont icon-ditujiansuo" title="缓冲区"></div>
        </template>
        <div class="tool-pop">
          <div class="map-tool iconfont icon-quandian" title="画点"></div>
          <div class="map-tool iconfont icon-huaxian" title="画线"></div>
          <div class="map-tool iconfont icon-quandian1" title="画圈"></div>
          <div class="map-tool iconfont icon-kuang" title="画框"></div>
          <div
            class="map-tool iconfont icon-duobianxingxuanze"
            title="画多边形"
          ></div>
        </div>
      </NPopover>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { NPopover } from 'naive-ui'
import { Color } from 'cesium'
import {
  cartesian3ToLngLat,
  mapStoreTool,
  DrawBase,
  DrawPointTool,
  DrawPolylineTool,
  DrawPolygonTool,
  DrawRectTool,
  DrawCircleTool
} from '@mo-yu/cesium'
import CommonMap from 'src/components/commonMap/CommonMap.vue'

const mapReady = ref(false)
let tool: DrawBase

onBeforeUnmount(() => {
  tool?.destroy()
})

function startPoint() {
  clearTool()
  const point = new DrawPointTool({})
  point.enable()
  point.eventBus.on('left-click', e => {
    const lnglat = cartesian3ToLngLat(e.point)
    console.log(lnglat)
  })
  tool = point
}

function startPolyline() {
  clearTool()
  const line = new DrawPolylineTool({
    point: {
      color: Color.BLACK.withAlpha(1)
    }
  })
  line.enable()
  line.eventBus.on('left-click', e => {
    const lnglat = cartesian3ToLngLat(e.point)
    console.log(lnglat)
  })
  tool = line
}

function startPolygon() {
  clearTool()
  const area = new DrawPolygonTool({
    point: {
      color: Color.RED.withAlpha(1)
    },
    polyline: {
      material: Color.GREEN.withAlpha(1)
    }
  })
  area.enable()
  area.eventBus.on('left-click', e => {
    const lnglat = cartesian3ToLngLat(e.point)
    console.log(lnglat)
  })
  tool = area
}

function startRect() {
  clearTool()
  const rect = new DrawRectTool({
    point: {
      color: Color.RED.withAlpha(1)
    },
    polyline: {
      material: Color.GREEN.withAlpha(1)
    }
  })
  rect.enable()
  rect.eventBus.on('left-click', e => {
    const lnglat = cartesian3ToLngLat(e.point)
    console.log(lnglat)
  })
  tool = rect
}

function startCircle() {
  clearTool()
  const circle = new DrawCircleTool({
    point: {
      color: Color.RED.withAlpha(1)
    },
    polyline: {
      material: Color.GREEN.withAlpha(1)
    },
    circle: {
      material: Color.PINK.withAlpha(1)
    }
  })
  circle.enable()
  circle.eventBus.on('left-click', e => {
    const lnglat = cartesian3ToLngLat(e.point)
    console.log(lnglat)
  })
  tool = circle
}

function clearTool() {
  tool?.destroy()
}

function onLoaded() {
  mapReady.value = true
  const sceneTool = mapStoreTool.getMap().sceneTool
  sceneTool.camera.flyTo(
    {
      heading: 230.46638857907013,
      pitch: -14.837349795178078,
      roll: 359.9994886504723,
      lng: 119.59408850634337,
      lat: 25.59125552168796,
      height: 139.85802837647012
    },
    1
  )
}
</script>

<style scoped lang="scss">
.draw-tool {
  width: 100%;
  height: 100%;
  position: relative;
  .data-tool {
    position: absolute;
    z-index: 999;
    top: 30px;
    right: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    .tool {
      width: 42px;
      height: 42px;
      margin-left: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(180deg, #00c3ff 0%, #007dd3 100%);
      border-radius: 2px;
      border: 1px solid rgba(255, 255, 255, 0.8);
      color: #ffffff;
      font-size: 28px;
    }
  }
}
.tool-pop {
  background-color: #007dd3;
  border: 1px solid rgba(255, 255, 255, 0.8);
  padding: 9px;
  .map-tool {
    margin: 5px 0;
    font-size: 24px;
    color: #ffffff;
    cursor: pointer;
  }
  .pop-label {
    margin: 5px 0;
    font-weight: bold;
    color: #ffffff;
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
