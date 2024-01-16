/*
 * @Author: zhouyinkui
 * @Date: 2024-01-04 17:19:02
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-15 09:59:45
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
import { defaultColor } from '../../../defaultVal'

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
 * 创建椭圆Graphics
 * @param options - 椭圆参数
 * @returns
 */
export function createEntityEllipseGraphics(options: EllipseEntityOption) {
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
  const ellipse = new EllipseGraphics({
    ...rest,
    material: getMeterialProperty(rest.material ?? defaultColor),
    outlineColor: getColorProperty(rest.outlineColor ?? defaultColor)
  })
  return ellipse
}

/**
 * 创建椭圆entity
 * @param options - 椭圆参数
 * @returns
 */
export function createEntityEllipse(options: EllipseEntityOption) {
  const ellipse = createEntityEllipseGraphics(options)
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
    ellipse
  })
}
