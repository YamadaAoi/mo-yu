/*
 * @Author: zhouyinkui
 * @Date: 2023-01-10 15:33:24
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-10 16:19:05
 * @Description:
 * Copyright (c) 2023 by piesat, All Rights Reserved.
 */
import { defineConfig, loadEnv, UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import checker from 'vite-plugin-checker'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  loadEnv(mode, process.cwd())
  const config: UserConfigExport = {
    server: {
      open: true
    },
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        assets: path.resolve(__dirname, './src/assets')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./src/assets/vars.scss";'
        }
      }
    }
  }
  if (command === 'serve') {
    config.server = {
      open: true,
      proxy: {
        // '/api': {
        //   target: '',
        //   changeOrigin: true
        // }
      }
    }
    config.plugins?.push(
      checker({
        vueTsc: true
      })
    )
  }
  return config
})
