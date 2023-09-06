<!--
 * @Author: zhouyinkui
 * @Date: 2023-09-06 15:16:40
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-06 17:02:35
 * @Description: 全屏工具代码示例
-->
<template>
  <NButton size="small" @click="toggleFullScreen">
    {{ fullScreen ? '退出全屏' : '全屏' }}
  </NButton>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { FullscreenTool } from '@mo-yu/core'
import { NButton } from 'naive-ui'

let tool: FullscreenTool
const fullScreen = ref(false)

onMounted(() => {
  tool = new FullscreenTool({ target: document.body })
  tool.enable()
  tool.eventBus.on('screen-change', e => {
    fullScreen.value = e.status
  })
})

onUnmounted(() => {
  tool.destroy()
})

function toggleFullScreen() {
  tool?.toggleFullscreen()
}
</script>

<style scoped scss></style>
