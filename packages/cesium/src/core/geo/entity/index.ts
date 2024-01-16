/*
 * @Author: zhouyinkui
 * @Date: 2024-01-05 17:49:46
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-15 10:53:20
 * @Description: Entity GEO
 */
import { Entity } from 'cesium'

/**
 * Entity内包含的所有形状
 */
export type EntityGraphics =
  | 'billboard'
  | 'box'
  | 'corridor'
  | 'cylinder'
  | 'ellipse'
  | 'ellipsoid'
  | 'label'
  | 'model'
  | 'tileset'
  | 'path'
  | 'plane'
  | 'point'
  | 'polygon'
  | 'polyline'
  | 'polylineVolume'
  | 'rectangle'
  | 'wall'

/**
 * Entity除形状外所需参数
 */
export type EntityOption = Omit<Entity.ConstructorOptions, EntityGraphics>

export * from './point'
export * from './polyline'
export * from './polygon'
export * from './ellipse'
export * from './wall'
