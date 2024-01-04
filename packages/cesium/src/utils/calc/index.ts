/*
 * @Author: zhouyinkui
 * @Date: 2024-01-04 18:02:09
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-04 18:07:40
 * @Description: 常用计算
 */
import { Cartesian3, Cartographic } from 'cesium'

/**
 * 计算两点间水平距离
 * @param p1 - 点1
 * @param p2 - 点2
 * @returns
 */
export function getHorizontalDistance(p1: Cartesian3, p2: Cartesian3) {
  const c1 = Cartographic.fromCartesian(p1)
  const c2 = Cartographic.fromCartesian(p2)
  return Cartesian3.distance(
    Cartesian3.fromRadians(c1.longitude, c1.latitude, c1.height),
    Cartesian3.fromRadians(c2.longitude, c2.latitude, c1.height)
  )
}
