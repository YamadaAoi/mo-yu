/*
 * @Author: zhouyinkui
 * @Date: 2024-08-06 10:33:59
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-08-09 13:45:10
 * @Description: Label
 */
import {
  Label,
  Cartesian2,
  Color,
  DistanceDisplayCondition,
  NearFarScalar,
  HeightReference,
  LabelStyle
} from 'cesium'
import { getColor } from '../../../material'
import {
  getpixelOffset,
  getPrimitiveDistanceDisplayCondition,
  getPrimitiveNearFarScalar
} from '../../../../utils/objectCreate'

/**
 * Label参数，改造了Label属性，
 * heightReference默认CLAMP_TO_GROUND
 * 在原始参数基础上更改了(使用css颜色)颜色类参数:
 * backgroundColor,fillColor,outlineColor
 * 扩展参数传递方式
 * distanceDisplayCondition: [near, far]
 * scaleByDistance: [number, number, number, number]
 * translucencyByDistance: [number, number, number, number]
 * pixelOffsetScaleByDistance: [number, number, number, number]
 */
export type LabelOption = Omit<
  Label.ConstructorOptions,
  | 'backgroundColor'
  | 'fillColor'
  | 'outlineColor'
  | 'distanceDisplayCondition'
  | 'pixelOffset'
  | 'scaleByDistance'
  | 'translucencyByDistance'
  | 'pixelOffsetScaleByDistance'
> & {
  backgroundColor?: Color | string
  fillColor?: Color | string
  outlineColor?: Color | string
  pixelOffset?: Cartesian2 | [number, number]
  distanceDisplayCondition?: [number, number] | DistanceDisplayCondition
  scaleByDistance?: [number, number, number, number] | NearFarScalar
  translucencyByDistance?: [number, number, number, number] | NearFarScalar
  pixelOffsetScaleByDistance?: [number, number, number, number] | NearFarScalar
}

/**
 * 创建Label.ConstructorOptions
 * @param options - Label参数
 * @returns
 */
export function createLabelOptions(options: LabelOption) {
  const {
    backgroundColor,
    fillColor,
    outlineColor,
    pixelOffset,
    distanceDisplayCondition,
    scaleByDistance,
    translucencyByDistance,
    pixelOffsetScaleByDistance,
    ...rest
  } = options
  const opt: Label.ConstructorOptions = {
    heightReference: HeightReference.CLAMP_TO_GROUND,
    style: LabelStyle.FILL_AND_OUTLINE,
    ...rest,
    backgroundColor: getColor(
      backgroundColor ?? new Color(0.165, 0.165, 0.165, 0.8)
    ),
    fillColor: getColor(fillColor ?? Color.WHITE),
    outlineColor: getColor(outlineColor ?? Color.BLACK),
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
