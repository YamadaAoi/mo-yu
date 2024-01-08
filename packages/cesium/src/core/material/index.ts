/*
 * @Author: zhouyinkui
 * @Date: 2024-01-02 15:14:34
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-08 11:33:42
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
  if (typeof color === 'string') {
    return Color.fromCssColorString(color)
  } else {
    return color
  }
}

/**
 * 获取cesium颜色对象或MaterialProperty
 * @param color - 材质
 * @returns
 */
export function getMeterialProperty(mat?: MaterialProperty | Color | string) {
  if (typeof mat === 'string') {
    return Color.fromCssColorString(mat)
  } else {
    return mat
  }
}

/**
 * 获取材质
 * @param mat - css颜色字符串 或 cesium颜色对象 或 材质
 * @returns
 */
export function getMeterial(mat?: Material | Color | string) {
  if (typeof mat === 'string') {
    return Material.fromType('Color', {
      color: Color.fromCssColorString(mat)
    })
  } else if (mat instanceof Color) {
    return Material.fromType('Color', { color: mat })
  } else {
    return mat
  }
}
