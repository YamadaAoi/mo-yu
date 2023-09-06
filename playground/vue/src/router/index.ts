/*
 * @Author: zhouyinkui
 * @Date: 2023-01-10 16:29:09
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-06 16:26:56
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
    children: [...getCoreMenus(), ...getVueMenus()]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
