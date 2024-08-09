/*
 * @Author: zhouyinkui
 * @Date: 2023-12-15 15:00:38
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-08-09 15:48:48
 * @Description:
 */
interface Window {
  CESIUM_BASE_URL: string
}

declare module 'cesium' {
  class EllipsoidalOccluder {
    constructor(ellipsoid: Ellipsoid, cameraPosition: Cartesian3)
    isPointVisible(occludee: Cartesian3): boolean
  }
}
