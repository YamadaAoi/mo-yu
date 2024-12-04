/*
 * @Author: zhouyinkui
 * @Date: 2023-09-11 11:13:53
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-12-04 10:06:28
 * @Description: rem工具代码示例
 */
import { remTool } from '@mo-yu/core'
// 打包脚本内引入
import pxtorem from 'postcss-pxtorem'

/**
 * 基础用法，指定设计稿宽高，或仅指定宽
 */
remTool.resetDesignSize({
  designWidth: 1920,
  designHeight: 1080
})
remTool.enable()
console.log(remTool.rem)

/**
 * 强制刷新rem
 */
remTool.resetOptions({
  designWidth: 1920,
  designHeight: 1080
})

/**
 * 监听rem变化
 */
remTool.eventBus.on('rem-refresh', e => {
  console.log(e.rem)
})

/**
 * 在vite或者webpack配置文件中，引入postcss-pxtorem插件协作
 */
pxtorem({
  rootValue: 100,
  unitPrecision: 5,
  propList: ['*'],
  selectorBlackList: [],
  replace: true,
  mediaQuery: false,
  minPixelValue: 10
})
