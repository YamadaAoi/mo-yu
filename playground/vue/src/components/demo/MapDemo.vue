<!--
 * @Author: zhouyinkui
 * @Date: 2024-01-08 13:36:09
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-08 14:16:08
 * @Description: 
-->
<template>
  <div class="map-demo">
    <slot name="demo"></slot>
    <div :class="['demo-code', show ? '' : 'hide-code']">
      <div class="demo-handle iconfont icon-code" @click="toggleShow"></div>
      <slot name="code"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const show = ref(false)

function toggleShow() {
  show.value = !show.value
}
</script>

<style scoped lang="scss">
.map-demo {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  .demo-code {
    width: 45%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 9999;
    transition: left 0.3s;
    .demo-handle {
      width: 30px;
      height: 42px;
      cursor: pointer;
      background-color: #0d1117;
      position: absolute;
      right: -30px;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
    }
  }
  .hide-code {
    left: -45%;
  }
}
</style>
