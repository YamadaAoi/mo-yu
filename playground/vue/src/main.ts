/*
 * @Author: zhouyinkui
 * @Date: 2023-01-10 15:33:55
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-12-18 14:44:29
 * @Description:
 */
import { createApp } from 'vue'
import { remTool } from '@mo-yu/core'
import { initCesium } from '@mo-yu/cesium'
import App from './App.vue'
import router from './router'
import 'assets/iconfont/iconfont.css'
import 'assets/app.scss'

remTool.resetDesignSize(1920, 1080)
remTool.enable()
initCesium(import.meta.env.CESIUM_BASE_URL, import.meta.env.CESIUM_ACCESS_TOKEN)

const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

createApp(App).use(router).mount('#app')
