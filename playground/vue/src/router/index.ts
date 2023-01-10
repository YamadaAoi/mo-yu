/*
 * @Author: zhouyinkui
 * @Date: 2023-01-10 16:29:09
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-10 16:41:46
 * @Description:
 * Copyright (c) 2023 by piesat, All Rights Reserved.
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

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
      {
        path: '/portal/popup',
        name: 'Popup',
        component: () => import('../views/portal/popup/Popup.vue'),
        meta: {
          label: '拖拽弹框'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
