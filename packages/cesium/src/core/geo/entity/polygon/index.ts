/*
 * @Author: zhouyinkui
 * @Date: 2024-01-02 15:31:44
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-18 18:29:40
 * @Description: Polygon
 */
import {
  Cartesian3,
  Color,
  DistanceDisplayCondition,
  Entity,
  MaterialProperty,
  PolygonGraphics,
  PolygonHierarchy,
  Property
} from 'cesium'
import { getColorProperty, getMeterialProperty } from '../../../material'
import { EntityOption } from '..'
import { defaultColor } from '../../../defaultVal'
import { getDistanceDisplayCondition } from '../../../../utils/objectCreate'

/**
 * PolygonEntity参数，改造了Polygon属性，在原始参数基础上更改了(使用css颜色)颜色类参数:
 * material
 * outlineColor
 * 扩展distanceDisplayCondition传递方式
 * distanceDisplayCondition: [near, far]
 */
export type PolygonEntityOption = EntityOption &
  Omit<
    PolygonGraphics.ConstructorOptions,
    'hierarchy' | 'material' | 'outlineColor' | 'distanceDisplayCondition'
  > & {
    hierarchy?: Property | PolygonHierarchy | Cartesian3[]
    material?: MaterialProperty | Color | string
    outlineColor?: Property | Color | string
    distanceDisplayCondition?:
      | [number, number]
      | Property
      | DistanceDisplayCondition
  }

/**
 * 获取多边形hierarchy
 * @param hierarchy - 位置
 * @returns
 */
function getHierarchy(hierarchy?: Property | PolygonHierarchy | Cartesian3[]) {
  return hierarchy === undefined
    ? undefined
    : Array.isArray(hierarchy)
    ? new PolygonHierarchy(hierarchy)
    : hierarchy
}

/**
 * 创建面Graphics
 * @param options - 面参数
 * @returns
 */
export function createEntityPolygonGraphics(options: PolygonEntityOption) {
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
  const polygon = new PolygonGraphics({
    ...rest,
    hierarchy: getHierarchy(rest.hierarchy),
    material: getMeterialProperty(rest.material ?? defaultColor),
    outlineColor: getColorProperty(rest.outlineColor ?? defaultColor),
    distanceDisplayCondition: getDistanceDisplayCondition(
      rest.distanceDisplayCondition
    )
  })
  return polygon
}

/**
 * 创建面entity
 * @param options - 面参数
 * @returns
 */
export function createEntityPolygon(options: PolygonEntityOption) {
  const polygon = createEntityPolygonGraphics(options)
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
    polygon
  })
}
