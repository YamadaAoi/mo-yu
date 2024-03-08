<!--
 * @Author: zhouyinkui
 * @Date: 2024-01-03 09:46:03
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-08 15:16:49
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { NPopover } from 'naive-ui'
import {
  DrawBase,
  DrawPointTool,
  DrawPolylineTool,
  DrawPolygonTool,
  DrawRectTool,
  DrawCircleTool
} from '@mo-yu/cesium'
import CommonMap from '../map/CommonMap.vue'

const mapReady = ref(false)
let tool: DrawBase

onBeforeUnmount(() => {
  tool?.destroy()
})

function startPoint() {
  clearTool()
  const point = new DrawPointTool({})
  point.enable()
  tool = point
}

function startPolyline() {
  clearTool()
  const line = new DrawPolylineTool({
    point: {
      color: '#00BFFF'
    },
    polyline: {
      clampToGround: true,
      material: 'rgba(135,206,235,0.7)'
    },
    floatPolyline: {
      material: 'rgba(135,206,235,0.5)'
    }
  })
  line.enable()
  tool = line
}

function startPolygon() {
  clearTool()
  const area = new DrawPolygonTool({
    point: {
      color: '#00FF7F'
    },
    polyline: {
      clampToGround: true,
      material: 'rgba(127,255,170,0.7)'
    },
    polygon: {
      clampToGround: true,
      material: 'rgba(127,255,170,0.7)'
    },
    floatPolyline: {
      material: 'rgba(127,255,170,0.5)'
    },
    floatPolygon: {
      material: 'rgba(127,255,170,0.5)'
    }
  })
  area.enable()
  tool = area
}

function startRect() {
  clearTool()
  const rect = new DrawRectTool({
    point: {
      color: '#FFA500'
    },
    polyline: {
      clampToGround: true,
      material: 'rgba(255,215,0,0.7)'
    },
    polygon: {
      clampToGround: true,
      material: 'rgba(255,215,0,0.7)'
    },
    floatPolyline: {
      material: 'rgba(255,215,0,0.5)'
    },
    floatPolygon: {
      material: 'rgba(255,215,0,0.5)'
    }
  })
  rect.enable()
  tool = rect
}

function startCircle() {
  clearTool()
  const circle = new DrawCircleTool({
    point: {
      color: '#FF4500'
    },
    polyline: {
      clampToGround: true,
      material: 'rgba(255,127,80,0.7)'
    },
    circle: {
      clampToGround: true,
      material: 'rgba(255,127,80,0.7)'
    },
    floatPolyline: {
      material: 'rgba(255,127,80,0.5)'
    },
    floatCircle: {
      material: 'rgba(255,127,80,0.5)'
    }
  })
  circle.enable()
  tool = circle
}

function clearTool() {
  tool?.destroy()
}

function onLoaded() {
  mapReady.value = true
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
