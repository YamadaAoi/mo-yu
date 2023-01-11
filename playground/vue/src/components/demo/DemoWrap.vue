<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-11 16:26:27
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-11 16:35:43
 * @Description: 
 * Copyright (c) 2023 by piesat, All Rights Reserved. 
-->
<template>
  <div class="demo-wrap">
    <div class="demo-col">
      <slot name="demo"></slot>
    </div>
    <div class="demo-col">
      <slot name="code"></slot>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.demo-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .demo-col {
    width: 50%;
    height: 100%;
    padding: 0.24rem;
    border-right: 1px solid rgb(239, 239, 245);
    @include scrollBase();
    &:last-of-type {
      border-right: 0;
    }
  }
}
</style>
