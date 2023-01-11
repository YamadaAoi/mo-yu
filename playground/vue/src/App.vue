<!--
 * @Author: zhouyinkui
 * @Date: 2022-06-28 13:04:10
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-11 15:08:07
 * @Description:
 * Copyright (c) 2022 by piesat, All Rights Reserved.
-->
<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider>
      <m-loading>
        <Header></Header>
        <div class="app-body"><router-view /></div>
      </m-loading>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NMessageProvider, zhCN, dateZhCN } from 'naive-ui'
import { remTool } from '@mo-yu/core'
import { MLoading } from '@mo-yu/vue'
import Header from './components/header/Header.vue'

remTool.enable()
</script>

<style scoped lang="scss">
.app-body {
  width: 100%;
  height: calc(100% - 0.64rem);
}
</style>
