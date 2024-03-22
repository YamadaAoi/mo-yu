/*
 * @Author: zhouyinkui
 * @Date: 2024-03-18 17:35:57
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-22 09:32:22
 * @Description: cesium内置对象创建
 */
import { Cartesian2, DistanceDisplayCondition, Property } from 'cesium'

/**
 * 构造DistanceDisplayCondition
 * @param condition - DistanceDisplayCondition参数
 * @returns
 */
export function getDistanceDisplayCondition(
  condition?: [number, number] | Property | DistanceDisplayCondition
) {
  return Array.isArray(condition)
    ? new DistanceDisplayCondition(condition[0], condition[1])
    : condition
}

/**
 * 构造pixelOffset(label，billboar等)
 * @param offset - 偏移
 * @returns
 */
export function getpixelOffset(offset?: Cartesian2 | [number, number]) {
  return Array.isArray(offset) ? new Cartesian2(offset[0], offset[1]) : offset
}
