/*
 * @Author: zhouyinkui
 * @Date: 2024-01-04 16:19:35
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-04 16:37:53
 * @Description: 获取位置
 */
import {
  Cartesian3,
  sampleTerrainMostDetailed,
  Cartographic,
  Cartesian2
} from 'cesium'
import { mapStoreTool } from '../../tools/storeTool'

/**
 * 获取鼠标事件点的位置
 * @param endPosition - 屏幕坐标
 * @returns
 */
export function getPosiOnAction(endPosition: Cartesian2) {
  const viewer = mapStoreTool.getMap()?.viewer
  let position: Cartesian3 | undefined
  if (viewer) {
    // entity，primitive，3dtile上的点
    try {
      position = viewer.scene.pickPosition(endPosition)
    } catch (error) {
      console.error('不是entity，primitive，3dtile上的点', error)
    }
    if (!position) {
      try {
        const ray = viewer.camera.getPickRay(endPosition)
        if (ray) {
          // 地形上的点
          position = viewer.scene.globe.pick(ray, viewer.scene)
        }
      } catch (err) {
        console.error('不是地形上的点', err)
      }
    }
  }
  return position
}

/**
 * 获取点在地形上的位置
 * @param posi - 世界坐标
 * @returns
 */
export async function getPosiOnTerrain(posi: Cartesian3) {
  const viewer = mapStoreTool.getMap()?.viewer
  if (viewer) {
    let result: Cartographic[] | undefined
    try {
      const cart = viewer.scene.globe.ellipsoid.cartesianToCartographic(posi)
      result = await sampleTerrainMostDetailed(viewer.terrainProvider, [cart])
    } catch (error) {
      console.error('点不在地形上', error)
    }
    const t = result?.[0]
    if (t instanceof Cartographic) {
      return Cartesian3.fromRadians(t.longitude, t.latitude, t.height)
    }
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
    let result: Cartesian3[] | undefined
    try {
      result = await viewer.scene.clampToHeightMostDetailed([posi])
    } catch (error) {
      console.error('点不在3DTiles上', error)
    }
    return result?.[0]
  }
}

/**
 * 获取点在当前地图上上的位置
 * 先尝试获取在几何体上的位置，获取失败再尝试获取在地形上的位置
 * 都失败则返回原位置
 * @param position - 世界坐标
 * @returns
 */
export async function getPosiOnMap(position: Cartesian3) {
  let point = await getPosiOn3DTiles(position)
  if (point === undefined) {
    point = await getPosiOnTerrain(position)
  }
  return point ?? position
}
