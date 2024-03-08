/*
 * @Author: zhouyinkui
 * @Date: 2023-01-10 15:33:55
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-08 17:21:32
 * @Description:
 */
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_Base_Url: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
