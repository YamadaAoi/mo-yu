/*
 * @Author: zhouyinkui
 * @Date: 2024-01-05 17:50:37
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-08-06 17:57:27
 * @Description: Primitive GEO
 */
import { GeometryInstance, GroundPrimitive, Matrix4, Primitive } from 'cesium'

/**
 * Primitive通用构造参数
 * 剔除appearance，depthFailAppearance，geometryInstances属性
 */
export type PrimitiveOption = Omit<
  NonNullable<ConstructorParameters<typeof Primitive>[0]>,
  'appearance' | 'depthFailAppearance' | 'geometryInstances' | 'modelMatrix'
> & {
  // 避免与GeometryInstance-modelMatrix冲突，重新定义
  primitiveModelMatrix?: Matrix4 | undefined
}

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
export * from './cylinder'
export * from './billboard'
export * from './label'
