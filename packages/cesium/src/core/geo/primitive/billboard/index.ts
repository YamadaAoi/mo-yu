/*
 * @Author: zhouyinkui
 * @Date: 2024-08-05 15:41:51
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-08-07 21:16:06
 * @Description: Billboard
 */
import {
  Billboard,
  Cartesian2,
  Color,
  DistanceDisplayCondition,
  HeightReference,
  NearFarScalar
} from 'cesium'
import { getColor } from '../../../material'
import {
  getpixelOffset,
  getPrimitiveDistanceDisplayCondition,
  getPrimitiveNearFarScalar
} from '../../../../utils/objectCreate'

/**
 * Billboard参数，改造了Billboard属性，
 * heightReference默认CLAMP_TO_GROUND
 * 在原始参数基础上更改了(使用css颜色)颜色类参数:
 * color
 * 扩展参数传递方式
 * distanceDisplayCondition: [near, far]
 * scaleByDistance: [number, number, number, number]
 * translucencyByDistance: [number, number, number, number]
 * pixelOffsetScaleByDistance: [number, number, number, number]
 */
export type BillboardOption = Omit<
  Billboard.ConstructorOptions,
  | 'color'
  | 'distanceDisplayCondition'
  | 'pixelOffset'
  | 'scaleByDistance'
  | 'translucencyByDistance'
  | 'pixelOffsetScaleByDistance'
> & {
  color?: Color | string
  pixelOffset?: Cartesian2 | [number, number]
  distanceDisplayCondition?: [number, number] | DistanceDisplayCondition
  scaleByDistance?: [number, number, number, number] | NearFarScalar
  translucencyByDistance?: [number, number, number, number] | NearFarScalar
  pixelOffsetScaleByDistance?: [number, number, number, number] | NearFarScalar
}

/**
 * 创建Billboard.ConstructorOptions
 * @param options - Billboard参数
 * @returns
 */
export function createBillboardOptions(options: BillboardOption) {
  const {
    color,
    pixelOffset,
    distanceDisplayCondition,
    scaleByDistance,
    translucencyByDistance,
    pixelOffsetScaleByDistance,
    ...rest
  } = options
  const opt: Billboard.ConstructorOptions = {
    heightReference: HeightReference.CLAMP_TO_GROUND,
    ...rest,
    color: getColor(color ?? Color.WHITE),
    pixelOffset: getpixelOffset(pixelOffset),
    distanceDisplayCondition: getPrimitiveDistanceDisplayCondition(
      distanceDisplayCondition
    ),
    scaleByDistance: getPrimitiveNearFarScalar(scaleByDistance),
    translucencyByDistance: getPrimitiveNearFarScalar(translucencyByDistance),
    pixelOffsetScaleByDistance: getPrimitiveNearFarScalar(
      pixelOffsetScaleByDistance
    )
  }
  return opt
}
