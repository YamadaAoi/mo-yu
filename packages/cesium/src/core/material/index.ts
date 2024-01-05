/*
 * @Author: zhouyinkui
 * @Date: 2024-01-02 15:14:34
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-05 14:58:51
 * @Description: 材质
 */
import { Color, Material } from 'cesium'

/**
 * 获取cesium颜色对象，不传获取随机颜色
 * @param color - 颜色
 * @returns
 */
export function getColor(color?: Color | string) {
  return color === undefined
    ? Color.fromRandom().withAlpha(1)
    : typeof color === 'string'
    ? Color.fromCssColorString(color)
    : color
}

/**
 * 获取材质
 * @param mat - css颜色字符串 或 cesium颜色对象 或 材质
 * @returns
 */
export function getMeterial(mat?: Material | Color | string) {
  return mat instanceof Material
    ? mat
    : Material.fromType('Color', { color: getColor(mat) })
}
