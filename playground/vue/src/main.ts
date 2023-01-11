/*
 * @Author: zhouyinkui
 * @Date: 2023-01-10 15:33:55
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-11 15:04:12
 * @Description:
 * Copyright (c) 2023 by piesat, All Rights Reserved.
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/app.scss'

const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

createApp(App).use(router).mount('#app')
