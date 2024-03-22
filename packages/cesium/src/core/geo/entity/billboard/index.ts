/*
 * @Author: zhouyinkui
 * @Date: 2024-02-01 15:05:41
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-22 10:50:54
 * @Description: Billboard
 */
import {
  Color,
  Entity,
  BillboardGraphics,
  Property,
  DistanceDisplayCondition,
  Cartesian2
} from 'cesium'
import { getColorProperty } from '../../../material'
import { EntityOption } from '..'
import {
  getDistanceDisplayCondition,
  getpixelOffset
} from '../../../../utils/objectCreate'

/**
 * BillboardEntity参数，改造了Billboard属性，在原始参数基础上更改了(使用css颜色)颜色类参数:
 * color
 * 扩展distanceDisplayCondition传递方式
 * distanceDisplayCondition: [near, far]
 */
export type BillboardEntityOption = EntityOption &
  Omit<
    BillboardGraphics.ConstructorOptions,
    'color' | 'distanceDisplayCondition' | 'pixelOffset'
  > & {
    color?: Property | Color | string
    pixelOffset?: Cartesian2 | [number, number]
    distanceDisplayCondition?:
      | [number, number]
      | Property
      | DistanceDisplayCondition
  }

/**
 * 创建BillboardGraphics.ConstructorOptions
 * @param options - Billboard参数
 * @returns
 */
export function createEntityBillboardGraphicsOptions(
  options: BillboardEntityOption
) {
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
    ...rest
  } = options
  const opt: BillboardGraphics.ConstructorOptions = {
    ...rest,
    color: getColorProperty(rest.color ?? Color.WHITE),
    pixelOffset: getpixelOffset(rest.pixelOffset),
    distanceDisplayCondition: getDistanceDisplayCondition(
      rest.distanceDisplayCondition
    )
  }
  return opt
}

/**
 * 创建BillboardGraphics
 * @param options - Billboard参数
 * @returns
 */
export function createEntityBillboardGraphics(options: BillboardEntityOption) {
  const opt = createEntityBillboardGraphicsOptions(options)
  const billboard = new BillboardGraphics(opt)
  return billboard
}

/**
 * 创建billboard entity
 * @param options - billboard参数
 * @returns
 */
export function createEntityBillboard(options: BillboardEntityOption) {
  const billboard = createEntityBillboardGraphics(options)
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
    billboard
  })
}
