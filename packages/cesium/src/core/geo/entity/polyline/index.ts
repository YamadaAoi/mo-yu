/*
 * @Author: zhouyinkui
 * @Date: 2024-01-02 14:50:46
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-18 18:30:39
 * @Description: Polyline
 */
import {
  Color,
  DistanceDisplayCondition,
  Entity,
  MaterialProperty,
  PolylineGraphics,
  Property
} from 'cesium'
import { getMeterialProperty } from '../../../material'
import { EntityOption } from '..'
import { defaultColor } from '../../../defaultVal'
import { getDistanceDisplayCondition } from '../../../../utils/objectCreate'

/**
 * PolylineEntity参数，改造了Polyline属性，在原始参数基础上更改了(使用css颜色)颜色类参数:
 * material
 * depthFailMaterial
 * 扩展distanceDisplayCondition传递方式
 * distanceDisplayCondition: [near, far]
 */
export type PolylineEntityOption = EntityOption &
  Omit<
    PolylineGraphics.ConstructorOptions,
    'material' | 'depthFailMaterial' | 'distanceDisplayCondition'
  > & {
    material?: MaterialProperty | Color | string
    depthFailMaterial?: MaterialProperty | Color | string
    distanceDisplayCondition?:
      | [number, number]
      | Property
      | DistanceDisplayCondition
  }

/**
 * 创建线Graphics
 * @param options - 线参数
 * @returns
 */
export function createEntityPolylineGraphics(options: PolylineEntityOption) {
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
  const polyline = new PolylineGraphics({
    ...rest,
    material: getMeterialProperty(rest.material ?? defaultColor),
    depthFailMaterial: getMeterialProperty(
      rest.depthFailMaterial ?? defaultColor
    ),
    distanceDisplayCondition: getDistanceDisplayCondition(
      rest.distanceDisplayCondition
    )
  })
  return polyline
}

/**
 * 创建线entity
 * @param options - 线参数
 * @returns
 */
export function createEntityPolyline(options: PolylineEntityOption) {
  const polyline = createEntityPolylineGraphics(options)
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
    polyline
  })
}
