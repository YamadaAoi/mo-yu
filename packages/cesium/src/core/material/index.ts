/*
 * @Author: zhouyinkui
 * @Date: 2024-01-02 15:14:34
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-05 14:08:47
 * @Description: 材质
 */
import { Color, Material } from 'cesium'

/**
 * 获取材质
 * @param mat - css颜色字符串 或 cesium颜色对象 或 材质
 * @returns
 */
export function getMeterial(mat?: Material | Color | string) {
  return typeof mat === 'string'
    ? Material.fromType('Color', {
        color: Color.fromCssColorString(mat)
      })
    : mat instanceof Color
    ? Material.fromType('Color', {
        color: mat
      })
    : mat
}
