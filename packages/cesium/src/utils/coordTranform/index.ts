/*
 * @Author: zhouyinkui
 * @Date: 2024-01-04 16:22:52
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-04 16:22:55
 * @Description:
 */
import { Math, Cartesian3, Ellipsoid } from 'cesium'

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
