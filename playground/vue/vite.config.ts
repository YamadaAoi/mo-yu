/*
 * @Author: zhouyinkui
 * @Date: 2023-01-10 15:33:24
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-05 17:35:11
 * @Description:
 * Copyright (c) 2023 by piesat, All Rights Reserved.
 */
import path from 'path'
import { defineConfig, loadEnv, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import pxtorem from 'postcss-pxtorem'
import postcssPresetEnv from 'postcss-preset-env'
import checker from 'vite-plugin-checker'
import strip from '@rollup/plugin-strip'
import viteCompression from 'vite-plugin-compression'

function getBrowsers(command: 'build' | 'serve') {
  return command === 'serve'
    ? [
        'last 1 chrome version',
        'last 1 firefox version',
        'last 1 safari version'
      ]
    : ['ie > 8', '>1%', 'not dead', 'not op_mini all']
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  loadEnv(mode, process.cwd())
  const config: UserConfig = {
    server: {
      open: true
    },
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src'),
        assets: path.resolve(__dirname, './src/assets')
      }
    },
    css: {
      postcss: {
        plugins: [
          pxtorem({
            rootValue: 100,
            unitPrecision: 5,
            propList: ['*'],
            selectorBlackList: [],
            replace: true,
            mediaQuery: false,
            minPixelValue: 10
            // exclude: (file: string) => {
            //   const regs = [/node_modules/i]
            //   const flag = regs.some(reg => reg.test(file))
            //   return flag
            // }
          }),
          postcssPresetEnv({
            browsers: getBrowsers(command)
          }) as any
        ]
      },
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./src/assets/vars.scss";'
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              const arr1 = id.toString().split('node_modules/')
              const arr2 = arr1[arr1.length - 1].split('/')
              switch (arr2[0]) {
                case '@vue':
                case 'vue-router':
                case 'naive-ui':
                case 'lodash-es':
                case '@mo-yu':
                  return 'vendor_' + arr2[0]
                default:
                  return 'vendor'
              }
            }
          }
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
  } else {
    config.plugins?.push(
      strip(),
      viteCompression({
        filter: /\.(js|mjs|json|css|html|ttf)$/i
      })
    )
  }
  return config
})
