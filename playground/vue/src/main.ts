/*
 * @Author: zhouyinkui
 * @Date: 2023-01-10 15:33:55
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-05 18:00:45
 * @Description:
 * Copyright (c) 2023 by piesat, All Rights Reserved.
 */
import { createApp } from 'vue'
import { remTool } from '@mo-yu/core'
import App from './App.vue'
import router from './router'
import 'assets/iconfont/iconfont.css'
import 'assets/app.scss'

remTool.resetDesignSize(1920, 1080)
remTool.enable()

const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

createApp(App).use(router).mount('#app')
