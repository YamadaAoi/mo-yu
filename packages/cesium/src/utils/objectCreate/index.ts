/*
 * @Author: zhouyinkui
 * @Date: 2024-03-18 17:35:57
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-08-09 16:26:20
 * @Description: cesium内置对象创建
 */
import {
  Cartesian2,
  DistanceDisplayCondition,
  NearFarScalar,
  Property
} from 'cesium'

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
 * 构造 Primitive DistanceDisplayCondition
 * @param condition - DistanceDisplayCondition参数
 * @returns
 */
export function getPrimitiveDistanceDisplayCondition(
  condition?: [number, number] | DistanceDisplayCondition
) {
  return Array.isArray(condition)
    ? new DistanceDisplayCondition(condition[0], condition[1])
    : condition
}

/**
 * 构造NearFarScalar
 * @param condition -
 * @returns
 */
export function getNearFarScalar(
  condition?: [number, number, number, number] | Property | NearFarScalar
) {
  return Array.isArray(condition)
    ? condition.length === 4
      ? new NearFarScalar(...condition)
      : undefined
    : condition
}

/**
 * 构造Primitive NearFarScalar
 * @param condition -
 * @returns
 */
export function getPrimitiveNearFarScalar(
  condition?: [number, number, number, number] | NearFarScalar
) {
  return Array.isArray(condition)
    ? condition.length === 4
      ? new NearFarScalar(...condition)
      : undefined
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
