/*
 * @Author: zhouyinkui
 * @Date: 2024-01-02 10:48:22
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-03 13:47:11
 * @Description: PointPrimitive
 */
import {
  Math,
  Cartesian3,
  Color,
  DistanceDisplayCondition,
  Ellipsoid,
  HeightReference,
  NearFarScalar,
  sampleTerrainMostDetailed
} from 'cesium'
import { mapStoreTool } from '../../../tools/storeTool'

/**
 * PointPrimitive属性
 */
export interface PointOption {
  position?: Cartesian3
  show?: boolean
  pixelSize?: number
  heightReference?: HeightReference
  color?: Color
  outlineColor?: Color
  outlineWidth?: number
  scaleByDistance?: NearFarScalar
  translucencyByDistance?: NearFarScalar
  distanceDisplayCondition?: DistanceDisplayCondition
  disableDepthTestDistance?: number
  id?: any
}

/**
 * 世界坐标(笛卡尔空间直角坐标)转经纬度坐标(WGS84坐标系)
 * @param cartesian3 - 笛卡尔空间直角坐标
 * @returns
 */
export function cartesian3ToLngLat(cartesian3: Cartesian3) {
  // const cartographic = Cartographic.fromCartesian(cartesian3)
  const cartographic = Ellipsoid.WGS84.cartesianToCartographic(cartesian3)
  const lat = Math.toDegrees(cartographic.latitude)
  const lng = Math.toDegrees(cartographic.longitude)
  const height = cartographic.height
  return [lng, lat, height]
}

/**
 * 获取点在地形上的位置
 * @param posi - 世界坐标
 * @returns
 */
export async function getPosiOnTerrain(posi: Cartesian3) {
  const viewer = mapStoreTool.getMap()?.viewer
  if (viewer) {
    const cart = viewer.scene.globe.ellipsoid.cartesianToCartographic(posi)
    const result = await sampleTerrainMostDetailed(viewer.terrainProvider, [
      cart
    ])
    const t = result[0]
    return Cartesian3.fromRadians(t.longitude, t.latitude, t.height)
  }
}

/**
 * 获取点在3DTiles上的位置
 * @param posi - 世界坐标
 * @returns
 */
export async function getPosiOn3DTiles(posi: Cartesian3) {
  const viewer = mapStoreTool.getMap()?.viewer
  if (viewer) {
    const result = await viewer.scene.clampToHeightMostDetailed([posi])
    return result?.[0]
  }
}

/**
 * 创建PointPrimitive参数对象，此方法会在heightReference为CLAMP_TO_GROUND时尝试获取点的高度
 * @param options - 原始参数
 * @returns
 */
export async function createPoint(options: PointOption): Promise<PointOption> {
  const defaultColor = Color.BLUE
  let position = options.position
  if (
    options.position &&
    options?.heightReference === HeightReference.CLAMP_TO_GROUND
  ) {
    let newPosi = await getPosiOn3DTiles(options.position)
    if (!newPosi) {
      newPosi = await getPosiOnTerrain(options.position)
    }
    if (newPosi) {
      position = newPosi
    }
  }
  return {
    ...options,
    position,
    show: options.show === undefined ? true : options.show,
    pixelSize: options.pixelSize ?? 10,
    color: options.color ?? defaultColor
  }
}
