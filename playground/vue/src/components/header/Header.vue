<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-11 10:18:37
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-05 18:07:39
 * @Description:
 * Copyright (c) 2023 by piesat, All Rights Reserved.
-->
<template>
  <div class="header">
    <img class="mo-yu-icon" :src="moyu" alt="" srcset="" />
    <div class="title">Mo Yu</div>
  </div>
</template>

<script setup lang="ts">
import moyu from 'src/assets/images/mo-yu.jpg'
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 64px;
  border-bottom: 1px solid rgb(239, 239, 245);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 32px;
  .mo-yu-icon {
    height: 56px;
  }
  .title {
    margin-left: 24px;
    color: rgb(31, 34, 37);
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
