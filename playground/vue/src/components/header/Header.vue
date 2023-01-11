<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-11 10:18:37
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-11 10:32:31
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
import moyu from 'assets/images/mo-yu.jpg'
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 0.64rem;
  border-bottom: 1px solid rgb(239, 239, 245);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 0.32rem;
  .mo-yu-icon {
    height: 0.56rem;
  }
  .title {
    margin-left: 0.24rem;
    color: rgb(31, 34, 37);
    font-size: 0.18rem;
    font-weight: bold;
  }
}
</style>
