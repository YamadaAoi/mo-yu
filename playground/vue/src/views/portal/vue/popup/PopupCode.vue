<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-11 15:48:33
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-06 17:03:33
 * @Description: 拖拽弹框代码示例
-->
<template>
  <NButton size="small" @click="togglePopup">
    {{ visiable ? '关闭' : '打开' }}弹框
  </NButton>
  <MPopup
    :mask="true"
    :visiable="visiable"
    title="我来组成头部"
    @close="togglePopup"
  >
    <div class="popup-content">我来组成身体</div>
  </MPopup>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NButton } from 'naive-ui'
import { MPopup } from '@mo-yu/vue'

const visiable = ref(false)

function togglePopup() {
  visiable.value = !visiable.value
}
</script>

<style scoped lang="scss">
.popup-content {
  width: 100%;
  height: 100%;
  padding: 32px;
  text-align: center;
}
</style>
