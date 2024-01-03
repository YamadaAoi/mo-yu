/*
 * @Author: zhouyinkui
 * @Date: 2023-12-15 14:58:29
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-02 11:17:23
 * @Description:
 */
import { Ion, SceneMode, Viewer } from 'cesium'
import { ToolBaseOptions } from '@mo-yu/core'

export interface MapOption extends ToolBaseOptions {
  /**
   * 当前地图实例唯一id
   */
  id: string
  baseOption?: Viewer.ConstructorOptions
}

/**
 * 位置信息
 */
export interface Position {
  lng: number
  lat: number
  height?: number
}

/**
 * 初始化cesium CESIUM_BASE_URL defaultAccessToken
 * @param baseURL - CESIUM_BASE_URL
 * @param token - defaultAccessToken
 */
export function initCesium(baseURL: string, token: string) {
  window.CESIUM_BASE_URL = baseURL
  Ion.defaultAccessToken = token
}

/**
 * cesium 默认初始化参数
 * @returns
 */
export function getDefaultOptions(): Viewer.ConstructorOptions {
  return {
    sceneMode: SceneMode.SCENE3D,
    // 查找位置工具
    geocoder: false,
    // 首页位置
    homeButton: false,
    // 3d/2d 模式切换按钮
    sceneModePicker: false,
    // 图层选择按钮
    baseLayerPicker: false,
    // 右上角的帮助按钮
    navigationHelpButton: false,
    // 左下角的动画控件的显示
    animation: false,
    // 底部的时间轴
    timeline: false,
    // 右下角的全屏按钮
    fullscreenButton: false,
    // 选择指示器
    selectionIndicator: false,
    // 信息面板
    infoBox: false,
    // VR模式
    vrButton: false,
    // 导航说明
    navigationInstructionsInitiallyVisible: false,
    // 阴影
    shadows: false,
    // 动画
    shouldAnimate: true
  }
}
