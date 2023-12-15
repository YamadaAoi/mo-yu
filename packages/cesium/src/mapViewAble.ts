/*
 * @Author: zhouyinkui
 * @Date: 2023-12-15 14:58:29
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-12-15 15:06:17
 * @Description:
 */
import { Cartesian3, Ellipsoid, Ion, Math, SceneMode, Viewer } from 'cesium'
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
 * 旋转参数
 * heading：偏航角
 * pitch：俯仰角
 * roll：翻滚角
 */
export interface Rotation {
  /**
   * 偏航角
   */
  heading?: number
  /**
   * 俯仰角
   */
  pitch?: number

  /**
   * 翻滚角
   */
  roll?: number
}

/**
 * 相机位置角度
 */
export type CameraParam = Partial<Position> & Partial<Rotation>

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
 * 世界坐标(笛卡尔空间直角坐标)转经纬度坐标(WGS84坐标系)
 * @param cartesian3 - 笛卡尔空间直角坐标
 * @returns
 */
export function cartesian3ToLngLat(cartesian3: Cartesian3) {
  // const cartographic = Cartographic.fromCartesian(cartesian3)
  const cartographic = Ellipsoid.WGS84.cartesianToCartographic(cartesian3)
  const lat = Math.toDegrees(cartographic.latitude)
  const lng = Math.toDegrees(cartographic.longitude)
  const height = cartographic.height
  return [lng, lat, height]
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
