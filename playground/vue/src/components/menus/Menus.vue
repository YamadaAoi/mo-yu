<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-11 10:35:56
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-12-18 14:41:11
 * @Description:
-->
<template>
  <div class="menus">
    <div v-for="(menu, i) in menus" :key="i" class="menu-cate">
      <div class="cate-name">{{ menu.cate }}</div>
      <div
        v-for="r in menu.routes"
        :key="r.path"
        class="menu-item"
        :class="[judgeStatus(route.matched, r) ? 'menu-chosen' : '']"
        :title="`${r.meta?.label} ${r.meta?.cname}`"
        @click="menuChange(r.path)"
      >
        {{ r.meta?.label }}
        &nbsp;
        <span>{{ r.meta?.cname }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  RouteLocationMatched,
  useRoute,
  useRouter,
  RouteRecordRaw
} from 'vue-router'
import { getCoreMenus, getVueMenus, getCesiumMenus } from '../../router'

const menus = [
  {
    cate: '@mo-yu/core',
    routes: getCoreMenus()
  },
  {
    cate: '@mo-yu/vue',
    routes: getVueMenus()
  },
  {
    cate: '@mo-yu/cesium',
    routes: getCesiumMenus()
  }
]
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
  width: 300px;
  height: 100%;
  padding: 0 8px;
  border-right: 1px solid rgb(239, 239, 245);
  @include scrollBase();
  .menu-cate {
    .cate-name {
      width: 100%;
      height: 42px;
      margin-top: 6px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0 18px 0 32px;
      color: rgb(118, 124, 130);
      font-size: 18px;
      @include textOver();
    }
    .menu-item {
      width: 100%;
      height: 42px;
      border-radius: 4px;
      margin-top: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0 18px 0 48px;
      color: black;
      font-size: 16px;
      span {
        font-size: 14px;
        color: rgb(118, 124, 130);
        @include textOver();
      }
      &:hover {
        background-color: rgb(243, 243, 245);
      }
      @include textOver();
    }
    .menu-chosen {
      color: #18a058;
      span {
        color: #18a058;
      }
      background-color: rgba(24, 160, 88, 0.1);
    }
  }
}
</style>
