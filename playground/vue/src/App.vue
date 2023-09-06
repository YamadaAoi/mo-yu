<!--
 * @Author: zhouyinkui
 * @Date: 2022-06-28 13:04:10
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-05 17:52:58
 * @Description:
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
import { MLoading } from '@mo-yu/vue'
import Header from './components/header/Header.vue'
</script>

<style scoped lang="scss">
.app-body {
  width: 100%;
  height: calc(100% - 64px);
}
</style>
