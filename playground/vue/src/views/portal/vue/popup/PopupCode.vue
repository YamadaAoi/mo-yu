<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-11 15:48:33
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-04-03 14:33:26
 * @Description: 拖拽弹框代码示例
-->
<template>
  <NButton size="small" @click="togglePopup">
    {{ visiable ? '关闭' : '打开' }}弹框
  </NButton>
  <MPopup :mask="true" :visiable="visiable">
    <template #head>
      <div class="popup-head">
        我来组成头部
        <span class="close" @click="togglePopup">&#10006;</span>
      </div>
    </template>
    <template #default><div class="popup-content">我来组成身体</div></template>
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
.popup-head {
  position: relative;
  width: 666px;
  height: 36px;
  line-height: 36px;
  padding-left: 22px;
  cursor: move;
  font-size: 20px;
  font-family: Microsoft YaHei;
  background-color: white;
  border-bottom: 1px solid rgb(239, 239, 245);
  .close {
    display: block;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 18px;
    cursor: pointer;
    font-size: 18px;
  }
}
.popup-content {
  width: 666px;
  height: 555px;
  background-color: white;
  padding: 32px;
  text-align: center;
}
</style>
