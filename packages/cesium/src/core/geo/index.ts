/*
 * @Author: zhouyinkui
 * @Date: 2024-01-02 16:02:31
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-05 14:13:40
 * @Description:
 */
import { GeometryInstance, GroundPrimitive, Primitive } from 'cesium'

/**
 * Primitive通用构造参数
 * 剔除appearance，depthFailAppearance，geometryInstances属性
 */
export type PrimitiveOption = Omit<
  NonNullable<ConstructorParameters<typeof Primitive>[0]>,
  'appearance' | 'depthFailAppearance' | 'geometryInstances'
>

/**
 * GroundPrimitive通用构造参数
 * 剔除appearance，geometryInstances属性
 */
export type GroundPrimitiveOption = Omit<
  NonNullable<ConstructorParameters<typeof GroundPrimitive>[0]>,
  'appearance' | 'geometryInstances'
>

/**
 * GeometryInstance通用构造参数
 * 剔除geometry
 */
export type GeometryInstanceOption = Omit<
  ConstructorParameters<typeof GeometryInstance>[0],
  'geometry'
>

export * from './point'
export * from './polyline'
export * from './polygon'
export * from './circle'
