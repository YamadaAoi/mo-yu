/*
 * @Author: zhouyinkui
 * @Date: 2023-09-11 11:13:53
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-20 10:37:50
 * @Description: rem工具代码示例
 */
import { remTool } from '@mo-yu/core'
// 打包脚本内引入
import pxtorem from 'postcss-pxtorem'

/**
 * 基础用法，指定设计稿宽高，或仅指定宽
 * 默认开启试验功能，body节点会缩放合适倍率（zoom）
 */
remTool.resetDesignSize(1920, 1080)
remTool.enable()
console.log(remTool.rem, remTool.zoom)

/**
 * 关闭试验功能，H5中使用打开ignoreDevicePixelRatio
 */
remTool.resetOptions({
  designWidth: 1920,
  designHeight: 1080,
  ignoreDevicePixelRatio: true
})

/**
 * 监听rem变化
 */
remTool.eventBus.on('rem-refresh', e => {
  console.log(e.rem, e.zoom)
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
