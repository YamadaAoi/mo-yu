/*
 * @Author: zhouyinkui
 * @Date: 2024-03-18 17:35:57
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-18 17:46:09
 * @Description: cesium内置对象创建
 */
import { DistanceDisplayCondition, Property } from 'cesium'

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
