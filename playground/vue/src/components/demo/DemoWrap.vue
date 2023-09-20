<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-11 16:26:27
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-20 10:28:43
 * @Description:  
-->
<template>
  <div class="demo-wrap">
    <div class="demo-col">
      <div class="demo-title">
        <slot name="title"></slot>
      </div>
      <div class="demo-sub-title">
        <slot name="subTitle"></slot>
      </div>
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
    padding: 24px;
    border-right: 1px solid rgb(239, 239, 245);
    @include scrollBase();
    &:last-of-type {
      border-right: 0;
    }
    .demo-title {
      color: rgb(31, 34, 37);
      font-size: 30px;
      font-weight: bold;
    }
    .demo-sub-title {
      color: rgb(31, 34, 37);
      font-size: 14px;
      margin: 20px 0;
    }
  }
}
</style>
