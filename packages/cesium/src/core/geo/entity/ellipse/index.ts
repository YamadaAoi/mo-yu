/*
 * @Author: zhouyinkui
 * @Date: 2024-01-04 17:19:02
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-05 19:07:01
 * @Description: Ellipse
 */
import {
  Color,
  Entity,
  MaterialProperty,
  EllipseGraphics,
  Property
} from 'cesium'
import { getColorProperty, getMeterialProperty } from '../../../material'
import { EntityOption } from '..'

/**
 * EllipseEntity参数，改造了Ellipse属性，在原始参数基础上更改了(使用css颜色)颜色类参数:
 * material
 * outlineColor
 */
export type EllipseEntityOption = EntityOption &
  Omit<EllipseGraphics.ConstructorOptions, 'material' | 'outlineColor'> & {
    material?: MaterialProperty | Color | string
    outlineColor?: Property | Color | string
  }

/**
 * 创建椭圆entity
 * @param options - 椭圆参数
 * @returns
 */
export function createEntityEllipse(options: EllipseEntityOption) {
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
  const polygon: EllipseGraphics.ConstructorOptions = {
    ...rest,
    material: getMeterialProperty(rest.material),
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
    polygon
  })
}
