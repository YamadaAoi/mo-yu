<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-11 16:38:40
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-06 17:03:26
 * @Description: Loading代码示例
-->
<template>
  <NButton size="small" @click="doFetch">请求数据</NButton>
</template>

<script setup lang="ts">
import { NButton, useMessage } from 'naive-ui'
import { useLoading } from '@mo-yu/vue'

/**
 * 使用前提：
 * 在App.vue或其他合适位置，使用MLoading组件包裹
 * import { MLoading } from '@mo-yu/vue'
 * <m-loading>
 *   <div class="app-body"><router-view /></div>
 * </m-loading>
 */
const { addLoading } = useLoading()
const message = useMessage()

function doFetch() {
  const remove = addLoading()
  fakeRequest()
    .then(() => {
      message.success('请求结束！')
      remove()
    })
    .catch(() => {
      message.error('请求失败！')
      remove()
    })
}

async function fakeRequest() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, 2000)
  })
}
</script>
