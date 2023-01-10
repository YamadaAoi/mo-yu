<!--
 * @Author: zhouyinkui
 * @Date: 2022-06-28 13:04:10
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-10 17:48:28
 * @Description:
 * Copyright (c) 2022 by piesat, All Rights Reserved.
-->
<template>
  <m-loading>
    <router-view />
  </m-loading>
</template>

<script setup lang="ts">
import { remTool } from '@mo-yu/core'
import { MLoading } from '@mo-yu/vue'

remTool.enable()
</script>
