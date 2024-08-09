/*
 * @Author: zhouyinkui
 * @Date: 2024-03-18 17:13:37
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-07-27 14:33:48
 * @Description: label
 */
import {
  Cartesian2,
  Color,
  DistanceDisplayCondition,
  Entity,
  JulianDate,
  LabelGraphics,
  LabelStyle,
  NearFarScalar,
  Property
} from 'cesium'
import { isNull } from '@mo-yu/core'
import { getColorProperty } from '../../../material'
import { EntityOption } from '..'
import { defaultColor } from '../../../defaultVal'
import {
  getDistanceDisplayCondition,
  getNearFarScalar,
  getpixelOffset
} from '../../../../utils/objectCreate'

/**
 * LabelEntity参数，改造了Label属性，在原始参数基础上更改了(使用css颜色)颜色类参数:
 * fillColor
 * backgroundColor
 * outlineColor
 * 增加了文本获取字段
 * field: text未提供时，取property内的[field]字段
 * 扩展pixelOffset传递方式
 * pixelOffset: [x, y]
 * 扩展distanceDisplayCondition传递方式
 * distanceDisplayCondition: [near, far]
 */
export type LabelEntityOption = EntityOption &
  Omit<
    LabelGraphics.ConstructorOptions,
    | 'fillColor'
    | 'backgroundColor'
    | 'outlineColor'
    | 'pixelOffset'
    | 'distanceDisplayCondition'
    | 'scaleByDistance'
    | 'translucencyByDistance'
  > & {
    fillColor?: Property | Color | string
    backgroundColor?: Property | Color | string
    outlineColor?: Property | Color | string
    field?: string
    pixelOffset?: Cartesian2 | [number, number]
    distanceDisplayCondition?:
      | [number, number]
      | Property
      | DistanceDisplayCondition
    scaleByDistance?:
      | [number, number, number, number]
      | Property
      | NearFarScalar
    translucencyByDistance?:
      | [number, number, number, number]
      | Property
      | NearFarScalar
  }

/**
 * 创建LabelGraphics.ConstructorOptions
 * @param options - Label参数
 * @returns
 */
export function createEntityLabelGraphicsOptions(options: LabelEntityOption) {
  const {
    id,
    name,
    availability,
    show,
    description,
    position,
    orientation,
    viewFrom,
    parent,
    properties,
    field,
    ...rest
  } = options
  let text = rest.text
  if (isNull(text) && !isNull(field)) {
    const val = properties?.getValue(JulianDate.now())?.[field as string]
    if (!isNull(val)) {
      text = `${val}`
    }
  }
  const opt: LabelGraphics.ConstructorOptions = {
    ...rest,
    text,
    fillColor: getColorProperty(rest.fillColor ?? defaultColor),
    backgroundColor: getColorProperty(rest.backgroundColor ?? defaultColor),
    outlineColor: getColorProperty(rest.outlineColor ?? defaultColor),
    pixelOffset: getpixelOffset(rest.pixelOffset),
    style: LabelStyle.FILL_AND_OUTLINE,
    distanceDisplayCondition: getDistanceDisplayCondition(
      rest.distanceDisplayCondition
    ),
    scaleByDistance: getNearFarScalar(rest.scaleByDistance),
    translucencyByDistance: getNearFarScalar(rest.translucencyByDistance)
  }
  return opt
}

/**
 * 创建LabelGraphics
 * @param options - Label参数
 * @returns
 */
export function createEntityLabelGraphics(options: LabelEntityOption) {
  const opt = createEntityLabelGraphicsOptions(options)
  const label = new LabelGraphics(opt)
  return label
}

/**
 * 创建label entity
 * @param options - label参数
 * @returns
 */
export function createEntityLabel(options: LabelEntityOption) {
  const label = createEntityLabelGraphics(options)
  return new Entity({
    id: options.id,
    name: options.name,
    availability: options.availability,
    show: options.show,
    description: options.description,
    position: options.position,
    orientation: options.orientation,
    viewFrom: options.viewFrom,
    parent: options.parent,
    properties: options.properties,
    label
  })
}
