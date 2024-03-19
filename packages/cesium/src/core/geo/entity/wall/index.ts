/*
 * @Author: zhouyinkui
 * @Date: 2024-01-15 10:53:29
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-18 18:33:12
 * @Description: Wall
 */
import {
  Cartesian3,
  Color,
  DistanceDisplayCondition,
  Entity,
  MaterialProperty,
  Property,
  WallGraphics
} from 'cesium'
import {
  createCustomMaterialProperty,
  getColorProperty,
  getMeterialProperty
} from '../../../material'
import { EntityOption } from '..'
import { defaultColor } from '../../../defaultVal'
import { CustomMaterial } from '../../../material'
import { getDistanceDisplayCondition } from '../../../../utils/objectCreate'

/**
 * WallEntity参数，改造了Wall属性，在原始参数基础上更改了(使用css颜色)颜色类参数:
 * material
 * outlineColor
 * 更改了高度数组围为数字，由实际的点数确定数组
 * minimumHeights
 * maximumHeights
 * 添加了自定义材质
 * customMaterial，会覆盖cesium原生材质material
 * 扩展distanceDisplayCondition传递方式
 * distanceDisplayCondition: [near, far]
 */
export type WallEntityOption = EntityOption &
  Omit<
    WallGraphics.ConstructorOptions,
    | 'positions'
    | 'minimumHeights'
    | 'maximumHeights'
    | 'material'
    | 'outlineColor'
    | 'distanceDisplayCondition'
  > & {
    material?: MaterialProperty | Color | string
    customMaterial?: CustomMaterial
    positions?: Cartesian3[]
    minimumHeights?: number
    maximumHeights?: number
    outlineColor?: Property | Color | string
    distanceDisplayCondition?:
      | [number, number]
      | Property
      | DistanceDisplayCondition
  }

function createWallMaterial(
  material?: MaterialProperty | Color | string,
  customMaterial?: CustomMaterial
) {
  if (customMaterial) {
    return createCustomMaterialProperty(customMaterial)
  } else {
    return getMeterialProperty(material)
  }
}

/**
 * 创建墙Graphics
 * @param options - 墙参数
 * @returns
 */
export function createEntityWallGraphics(options: WallEntityOption) {
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
  const wall = new WallGraphics({
    ...rest,
    minimumHeights: new Array((options.positions ?? []).length).fill(
      options.minimumHeights ?? 0
    ),
    maximumHeights: new Array((options.positions ?? []).length).fill(
      options.maximumHeights ?? 500
    ),
    material: createWallMaterial(
      rest.material ?? defaultColor,
      options.customMaterial
    ),
    outlineColor: getColorProperty(rest.outlineColor ?? defaultColor),
    distanceDisplayCondition: getDistanceDisplayCondition(
      rest.distanceDisplayCondition
    )
  })
  return wall
}

/**
 * 创建墙entity
 * @param options - 墙参数
 * @returns
 */
export function createEntityWall(options: WallEntityOption) {
  const wall = createEntityWallGraphics(options)
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
    wall
  })
}
