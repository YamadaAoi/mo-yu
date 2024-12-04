/*
 * @Author: zhouyinkui
 * @Date: 2023-01-10 15:33:55
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-12-04 10:03:48
 * @Description:
 */
import { createApp } from 'vue'
import { remTool } from '@mo-yu/core'
import App from './App.vue'
import router from './router'
import 'assets/iconfont/iconfont.css'
import 'assets/app.scss'

remTool.resetDesignSize({
  designWidth: 1920,
  designHeight: 1080
})
remTool.enable()

const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

createApp(App).use(router).mount('#app')
