/*
 * @Author: zhouyinkui
 * @Date: 2023-01-10 16:43:37
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-10 16:43:38
 * @Description:
 * Copyright (c) 2023 by piesat, All Rights Reserved.
 */
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 菜单名
     */
    label?: string
  }
}
