<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-10 16:33:28
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-11 16:29:25
 * @Description:
 * Copyright (c) 2023 by piesat, All Rights Reserved.
-->
<template>
  <div class="portal">
    <Menus></Menus>
    <div class="demos"><router-view /></div>
  </div>
</template>

<script setup lang="ts">
import Menus from '../../components/menus/Menus.vue'
</script>

<style scoped lang="scss">
.portal {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-self: center;
  .demos {
    width: calc(100% - 3rem);
    height: 100%;
  }
}
</style>
