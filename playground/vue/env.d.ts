/*
 * @Author: zhouyinkui
 * @Date: 2022-04-11 10:52:17
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-12-01 11:24:41
 * @Description: 声名文件扩充
 * Copyright (c) 2022 by piesat, All Rights Reserved.
 */
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Window {
  CESIUM_BASE_URL: string
}

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_Base_Url: string
  readonly CESIUM_BASE_URL: string
  readonly CESIUM_ACCESS_TOKEN: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
