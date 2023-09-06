<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-10 16:33:28
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-06 13:36:38
 * @Description:
-->
<template>
  <div class="portal">
    <Menus></Menus>
    <div class="demos"><router-view /></div>
  </div>
</template>

<script setup lang="ts">
import Menus from 'src/components/menus/Menus.vue'
</script>

<style scoped lang="scss">
.portal {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-self: center;
  .demos {
    width: calc(100% - 300px);
    height: 100%;
  }
}
</style>
