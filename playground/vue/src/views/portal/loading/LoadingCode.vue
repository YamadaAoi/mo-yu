<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-11 16:38:40
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-12 10:41:36
 * @Description: 
 * Copyright (c) 2023 by piesat, All Rights Reserved. 
-->
<template>
  <n-button @click="doFetch">请求数据</n-button>
</template>

<script setup lang="ts">
import { NButton, useMessage } from 'naive-ui'
import { useLoading } from '@mo-yu/vue'

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
