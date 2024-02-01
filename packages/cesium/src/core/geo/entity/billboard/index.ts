/*
 * @Author: zhouyinkui
 * @Date: 2024-02-01 15:05:41
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-02-01 15:14:47
 * @Description: Billboard
 */
import { Color, Entity, BillboardGraphics, Property } from 'cesium'
import { getColorProperty } from '../../../material'
import { EntityOption } from '..'

/**
 * BillboardEntity参数，改造了Billboard属性，在原始参数基础上更改了(使用css颜色)颜色类参数:
 * color
 */
export type BillboardEntityOption = EntityOption &
  Omit<BillboardGraphics.ConstructorOptions, 'color'> & {
    color?: Property | Color | string
  }

/**
 * 创建BillboardGraphics
 * @param options - Billboard参数
 * @returns
 */
export function createEntityBillboardGraphics(options: BillboardEntityOption) {
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
  const billboard = new BillboardGraphics({
    ...rest,
    color: getColorProperty(rest.color ?? Color.WHITE)
  })
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
