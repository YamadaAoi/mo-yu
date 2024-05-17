/*
 * @Author: zhouyinkui
 * @Date: 2024-01-02 10:48:22
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-08 10:54:11
 * @Description: PointPrimitive
 */
import {
  Cartesian3,
  Color,
  DistanceDisplayCondition,
  NearFarScalar
} from 'cesium'
import { getPosiOnMap } from '../../../../utils/getPosi'
import { getColor } from '../../../material'
import { defaultColor } from '../../../defaultVal'

/**
 * PointPrimitive属性
 */
export interface PointOption {
  show?: boolean
  position?: Cartesian3
  scaleByDistance?: NearFarScalar
  translucencyByDistance?: NearFarScalar
  pixelSize?: number
  color?: Color | string
  outlineColor?: Color | string
  outlineWidth?: number
  distanceDisplayCondition?: DistanceDisplayCondition
  disableDepthTestDistance?: number
  id?: any

  clampToGround?: boolean
}

/**
 * 创建PointPrimitive参数对象，此方法会在clampToGround为true时尝试获取点的高度
 * @param options - 原始参数
 * @returns
 */
export async function createPoint(options: PointOption): Promise<PointOption> {
  let position = options.position
  if (options.position && options?.clampToGround) {
    const newPosi = await getPosiOnMap(options.position)
    if (newPosi) {
      position = newPosi
    }
  }
  return {
    ...options,
    position,
    show: options.show === undefined ? true : options.show,
    pixelSize: options.pixelSize ?? 10,
    color: getColor(options.color ?? defaultColor),
    outlineColor: getColor(options.outlineColor ?? defaultColor)
  }
}
