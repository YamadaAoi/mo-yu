/*
 * @Author: zhouyinkui
 * @Date: 2024-01-02 10:48:22
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-05 19:07:21
 * @Description: Point
 */
import { Color, Entity, PointGraphics, Property } from 'cesium'
import { getColorProperty } from '../../../material'
import { EntityOption } from '..'

/**
 * PointEntity参数，改造了Point属性，在原始参数基础上更改了(使用css颜色)颜色类参数:
 * color
 * outlineColor
 */
export type PointEntityOption = EntityOption &
  Omit<PointGraphics.ConstructorOptions, 'color' | 'outlineColor'> & {
    color?: Property | Color | string
    outlineColor?: Property | Color | string
  }

/**
 * 创建点entity
 * @param options - 点参数
 * @returns
 */
export function createEntityPoint(options: PointEntityOption) {
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
  const point: PointGraphics.ConstructorOptions = {
    ...rest,
    color: getColorProperty(rest.color),
    outlineColor: getColorProperty(rest.outlineColor)
  }
  return new Entity({
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
    point
  })
}
