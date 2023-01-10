/*
 * @Author: zhouyinkui
 * @Date: 2023-01-10 15:33:55
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-10 16:56:30
 * @Description:
 * Copyright (c) 2023 by piesat, All Rights Reserved.
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/app.scss'

createApp(App).use(router).mount('#app')
