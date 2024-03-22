/*
 * @Author: zhouyinkui
 * @Date: 2024-01-02 10:48:22
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-22 10:54:30
 * @Description: Point
 */
import {
  Color,
  DistanceDisplayCondition,
  Entity,
  PointGraphics,
  Property
} from 'cesium'
import { getColorProperty } from '../../../material'
import { EntityOption } from '..'
import { defaultColor } from '../../../defaultVal'
import { getDistanceDisplayCondition } from '../../../../utils/objectCreate'

/**
 * PointEntity参数，改造了Point属性，在原始参数基础上更改了(使用css颜色)颜色类参数:
 * color
 * outlineColor
 * 扩展distanceDisplayCondition传递方式
 * distanceDisplayCondition: [near, far]
 */
export type PointEntityOption = EntityOption &
  Omit<
    PointGraphics.ConstructorOptions,
    'color' | 'outlineColor' | 'distanceDisplayCondition'
  > & {
    color?: Property | Color | string
    outlineColor?: Property | Color | string
    distanceDisplayCondition?:
      | [number, number]
      | Property
      | DistanceDisplayCondition
  }

/**
 * 创建点Graphics.ConstructorOptions
 * @param options - 点参数
 * @returns
 */
export function createEntityPointGraphicsOptions(options: PointEntityOption) {
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
  const opt: PointGraphics.ConstructorOptions = {
    ...rest,
    color: getColorProperty(rest.color ?? defaultColor),
    outlineColor: getColorProperty(rest.outlineColor ?? defaultColor),
    distanceDisplayCondition: getDistanceDisplayCondition(
      rest.distanceDisplayCondition
    )
  }
  return opt
}

/**
 * 创建点Graphics
 * @param options - 点参数
 * @returns
 */
export function createEntityPointGraphics(options: PointEntityOption) {
  const opt = createEntityPointGraphicsOptions(options)
  const point = new PointGraphics(opt)
  return point
}

/**
 * 创建点entity
 * @param options - 点参数
 * @returns
 */
export function createEntityPoint(options: PointEntityOption) {
  const point = createEntityPointGraphics(options)
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
    point
  })
}
