/*
 * @Author: zhouyinkui
 * @Date: 2024-01-02 15:14:34
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-02 15:18:38
 * @Description: 材质
 */
import { Color, Material } from 'cesium'

/**
 * 获取材质
 * @param mat - 颜色或材质
 * @returns
 */
export function getMeterial(mat?: Material | Color) {
  return mat instanceof Color
    ? Material.fromType('Color', {
        color: mat
      })
    : mat
}
