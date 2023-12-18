/*
 * @Author: zhouyinkui
 * @Date: 2023-01-10 16:29:09
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-12-18 14:40:17
 * @Description:
 */
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

export function getCoreMenus() {
  const menus: RouteRecordRaw[] = [
    {
      path: '/portal/fullScreen',
      name: 'FullScreen',
      component: () => import('../views/portal/core/fullScreen/FullScreen.vue'),
      meta: {
        label: '全屏工具',
        cname: 'FullscreenTool'
      }
    },
    {
      path: '/portal/drag',
      name: 'Drag',
      component: () => import('../views/portal/core/drag/DragDemo.vue'),
      meta: {
        label: '拖拽工具',
        cname: 'DragTool'
      }
    },
    {
      path: '/portal/rem',
      name: 'Rem',
      component: () => import('../views/portal/core/rem/RemDemo.vue'),
      meta: {
        label: '适配工具',
        cname: 'remTool'
      }
    },
    {
      path: '/portal/locale',
      name: 'Locale',
      component: () => import('../views/portal/core/locale/LocaleDemo.vue'),
      meta: {
        label: '国际化工具',
        cname: 'LocaleTool'
      }
    }
  ]
  return menus
}

export function getVueMenus() {
  const menus: RouteRecordRaw[] = [
    {
      path: '/portal/popup',
      name: 'Popup',
      component: () => import('../views/portal/vue/popup/Popup.vue'),
      meta: {
        label: '拖拽弹框',
        cname: 'MPopup'
      }
    },
    {
      path: '/portal/loading',
      name: 'Loading',
      component: () => import('../views/portal/vue/loading/Loading.vue'),
      meta: {
        label: '等待遮罩',
        cname: 'MLoading'
      }
    },
    {
      path: '/portal/highlight',
      name: 'Highlight',
      component: () => import('../views/portal/vue/highlight/Highlight.vue'),
      meta: {
        label: '高亮关键字',
        cname: 'MHighlight'
      }
    },
    {
      path: '/portal/aniNumber',
      name: 'AniNumber',
      component: () => import('../views/portal/vue/aniNumber/AniNumber.vue'),
      meta: {
        label: '数字动画',
        cname: 'MAniNumber'
      }
    },
    {
      path: '/portal/remHook',
      name: 'RemHook',
      component: () => import('../views/portal/vue/useRem/RemHook.vue'),
      meta: {
        label: 'RemHook',
        cname: 'useRem'
      }
    }
  ]
  return menus
}

export function getCesiumMenus() {
  const menus: RouteRecordRaw[] = [
    {
      path: '/portal/tiles',
      name: 'Tiles',
      component: () => import('../views/portal/cesium/tile/TileConfig.vue'),
      meta: {
        label: '3DTiles',
        cname: 'MapTile[Config]Tool'
      }
    }
  ]
  return menus
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/portal'
  },
  {
    path: '/portal',
    name: 'Portal',
    component: () => import('../views/portal/Portal.vue'),
    redirect: '/portal/fullScreen',
    children: [...getCoreMenus(), ...getVueMenus(), ...getCesiumMenus()]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
