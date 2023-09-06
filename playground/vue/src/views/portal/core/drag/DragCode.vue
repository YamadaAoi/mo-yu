<!--
 * @Author: zhouyinkui
 * @Date: 2023-09-06 16:11:25
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-06 17:20:24
 * @Description: 拖拽工具代码示例
-->
<template>
  <div id="dragWrap">
    <div id="dragEle"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { DragTool } from '@mo-yu/core'
import { useRem } from '@mo-yu/vue'

const { zoom } = useRem()
const tool = new DragTool({
  handleId: 'dragEle',
  wrapId: 'dragWrap',
  // 如果页面通过样式缩放，需要传递缩放值
  // 如果用了remTool的zoom试验功能，需要监听zoom并更新
  zoom: zoom.value
})

watch(
  zoom,
  next => {
    tool.resetZoom(next)
  },
  { immediate: true }
)

onMounted(() => {
  tool.enable()
  tool.locate('center')
})

onUnmounted(() => {
  tool.destroy()
})
</script>

<style scoped lang="scss">
#dragWrap {
  width: 300px;
  height: 280px;
  background-color: #ccc;
  #dragEle {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: grab;
    background-color: aquamarine;
  }
}
</style>
