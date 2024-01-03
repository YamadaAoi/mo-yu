/*
 * @Author: zhouyinkui
 * @Date: 2024-01-02 16:37:36
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-02 16:40:17
 * @Description:
 */
import { Cartesian2, Cartesian3, Viewer } from 'cesium'

/**
 * 获取鼠标事件点的位置
 * @param endPosition - 屏幕坐标
 * @param viewer - 地图实例
 * @returns
 */
export function getActionPosition(endPosition: Cartesian2, viewer: Viewer) {
  let position: Cartesian3 | undefined
  // entity，primitive，3dtile上的点
  try {
    position = viewer.scene.pickPosition(endPosition)
  } catch (error) {
    console.error('不是entity，primitive，3dtile上的点', error)
  }
  if (!position) {
    const ray = viewer.camera.getPickRay(endPosition)
    if (ray) {
      // 地形上的点
      position = viewer.scene.globe.pick(ray, viewer.scene)
    }
  }

  return position
}
