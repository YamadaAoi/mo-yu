/*
 * @Author: zhouyinkui
 * @Date: 2024-01-02 15:14:34
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-05 19:01:55
 * @Description: 材质
 */
import { Color, Material, MaterialProperty, Property } from 'cesium'

/**
 * 获取cesium颜色对象
 * @param color - 颜色
 * @returns
 */
export function getColor(color?: Color | string) {
  return typeof color === 'string' ? Color.fromCssColorString(color) : color
}

/**
 * 获取cesium颜色对象或颜色Property
 * @param color - 颜色
 * @returns
 */
export function getColorProperty(color?: Property | Color | string) {
  return color instanceof Property ? color : getColor(color)
}

/**
 * 获取cesium颜色对象或MaterialProperty
 * @param color - 材质
 * @returns
 */
export function getMeterialProperty(mat?: MaterialProperty | Color | string) {
  return mat instanceof MaterialProperty ? mat : getColor(mat)
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
