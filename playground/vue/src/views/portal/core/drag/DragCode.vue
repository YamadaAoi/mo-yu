<!--
 * @Author: zhouyinkui
 * @Date: 2023-09-06 16:11:25
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-12-04 10:04:55
 * @Description: 拖拽工具代码示例
-->
<template>
  <div id="dragWrap">
    <div id="dragEle"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { DragTool } from '@mo-yu/core'

const tool = new DragTool({
  handleId: 'dragEle',
  wrapId: 'dragWrap'
})

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
