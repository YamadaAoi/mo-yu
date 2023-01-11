<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-11 10:35:56
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-11 17:02:36
 * @Description:
 * Copyright (c) 2023 by piesat, All Rights Reserved.
-->
<template>
  <div class="menus">
    <div
      v-for="(menu, i) in menus"
      :key="i"
      class="menu-item"
      :class="[judgeStatus(route.matched, menu) ? 'menu-chosen' : '']"
      @click="menuChange(menu.path)"
    >
      {{ menu.meta?.label }}
      &nbsp;
      <span>{{ menu.meta?.cname }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  RouteLocationMatched,
  useRoute,
  useRouter,
  RouteRecordRaw
} from 'vue-router'
import { getDemoMenus } from '../../router'

const menus = ref(getDemoMenus())
const router = useRouter()
const route = useRoute()

function menuChange(path: string) {
  router.push(path).catch(err => {
    console.error(`路由跳转${path}失败！${err}`)
  })
}

function judgeStatus(matched: RouteLocationMatched[], menu: RouteRecordRaw) {
  return matched?.some((m: RouteLocationMatched) => m.name === menu.name)
}
</script>

<style scoped lang="scss">
.menus {
  width: 3rem;
  height: 100%;
  padding: 0 0.08rem;
  border-right: 1px solid rgb(239, 239, 245);
  @include scrollBase();
  .menu-item {
    width: 100%;
    height: 0.42rem;
    border-radius: 0.04rem;
    margin-top: 0.06rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 0.18rem 0 0.48rem;
    color: black;
    font-size: 0.16rem;
    span {
      font-size: 0.14rem;
      color: rgb(118, 124, 130);
    }
    &:hover {
      background-color: rgb(243, 243, 245);
    }
  }
  .menu-chosen {
    color: #18a058;
    span {
      color: #18a058;
    }
    background-color: rgba(24, 160, 88, 0.1);
  }
}
</style>
