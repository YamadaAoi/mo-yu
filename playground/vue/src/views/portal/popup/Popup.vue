<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-10 16:42:07
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-11 16:33:29
 * @Description:
 * Copyright (c) 2023 by piesat, All Rights Reserved.
-->
<template>
  <demo-wrap>
    <template #demo>
      <n-button @click="togglePopup">
        {{ visiable ? '关闭' : '打开' }}弹框
      </n-button>
      <m-popup
        :style="{ width: '4.5rem' }"
        :visiable="visiable"
        title="我来组成头部"
        @close="togglePopup"
      >
        <div class="popup-content">我来组成身体</div>
      </m-popup>
    </template>
    <template #code>
      <popup-code></popup-code>
    </template>
  </demo-wrap>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NButton } from 'naive-ui'
import { MPopup } from '@mo-yu/vue'
import DemoWrap from '../../../components/demo/DemoWrap.vue'
import PopupCode from './PopupCode'

const visiable = ref(false)

function togglePopup() {
  visiable.value = !visiable.value
}
</script>

<style scoped lang="scss">
.popup-content {
  width: 100%;
  height: 100%;
  padding: 0.32rem;
  text-align: center;
}
</style>
