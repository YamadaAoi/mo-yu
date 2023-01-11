/*
 * @Author: zhouyinkui
 * @Date: 2023-01-10 16:29:09
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-11 16:46:45
 * @Description:
 * Copyright (c) 2023 by piesat, All Rights Reserved.
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

export function getDemoMenus() {
  const menus: RouteRecordRaw[] = [
    {
      path: '/portal/popup',
      name: 'Popup',
      component: () => import('../views/portal/popup/Popup.vue'),
      meta: {
        label: '拖拽弹框',
        cname: 'MPopup'
      }
    },
    {
      path: '/portal/loading',
      name: 'Loading',
      component: () => import('../views/portal/loading/Loading.vue'),
      meta: {
        label: '等待遮罩',
        cname: 'MLoading'
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
    children: [
      {
        path: '',
        name: 'PopupRedirect',
        redirect: '/portal/popup'
      },
      ...getDemoMenus()
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
