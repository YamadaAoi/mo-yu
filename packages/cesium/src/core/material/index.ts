/*
 * @Author: zhouyinkui
 * @Date: 2024-01-02 15:14:34
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-04-11 18:22:21
 * @Description: 材质
 */
import { Color, Material, MaterialProperty, Property } from 'cesium'
import { FlowMaterialOptions, FlowMaterialProperty } from './addMaterial/flow'
import {
  FlashMaterialOptions,
  FlashMaterialProperty
} from './addMaterial/flash'

export interface CustomMaterial {
  flow?: FlowMaterialOptions
  flash?: FlashMaterialOptions
}

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

/**
 * 创建色带
 * @param colors - 颜色断点
 * @param vertical - false:横向/true:纵向
 */
export function createLinearImage(colors: string[], vertical?: boolean) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 1
  const ctx = canvas.getContext('2d')
  if (ctx && colors?.length) {
    let gradient: CanvasGradient
    if (vertical) {
      canvas.height = 256
      canvas.width = 1
      gradient = ctx.createLinearGradient(0, 0, 0, 256)
      colors.forEach((c, i, arr) => {
        gradient.addColorStop(i / (arr.length - 1), c)
      })
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 1, 256)
    } else {
      gradient = ctx.createLinearGradient(0, 0, 256, 0)
      colors.forEach((c, i, arr) => {
        gradient.addColorStop(i / (arr.length - 1), c)
      })
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 256, 1)
    }
  }
  return canvas
}

/**
 * 创建自定义材质Property
 * @param option - 自定义材质参数
 * @returns
 */
export function createCustomMaterialProperty(option: CustomMaterial) {
  if (option?.flow) {
    const u = {
      speed: option.flow.speed,
      vertical: option.flow.vertical,
      color: getColor(option.flow.color),
      image: option.flow.colors?.length
        ? createLinearImage(option.flow.colors, option.flow.vertical)
        : option.flow.image
    }
    return new FlowMaterialProperty(u)
  } else if (option?.flash) {
    const u = {
      speed: option.flash.speed,
      color: getColor(option.flash.color),
      image: option.flash.colors?.length
        ? createLinearImage(option.flash.colors, option.flash.vertical)
        : option.flash.image
    }
    return new FlashMaterialProperty(u)
  }
}

/**
 * 创建自定义材质
 * @param option - 自定义材质参数
 * @returns
 */
export function createCustomMaterial(option: CustomMaterial) {
  if (option?.flow) {
    return Material.fromType('Flow', {
      speed: option.flow.speed,
      orient: option.flow.vertical ? 1 : 0,
      color: getColor(option.flow.color ?? 'white'),
      image: option.flow.colors?.length
        ? createLinearImage(option.flow.colors, option.flow.vertical)
        : option.flow.image
    })
  } else if (option?.flash) {
    return Material.fromType('Flash', {
      speed: option.flash.speed,
      color: getColor(option.flash.color),
      image: option.flash.colors?.length
        ? createLinearImage(option.flash.colors, option.flash.vertical)
        : option.flash.image
    })
  }
}

/**
 * 创建自定义材质或原生材质Property
 * @param material - 原生材质
 * @param customMaterial - 自定义材质
 * @returns
 */
export function createMaterialProperty(
  material?: MaterialProperty | Color | string,
  customMaterial?: CustomMaterial
) {
  if (customMaterial) {
    return createCustomMaterialProperty(customMaterial)
  } else {
    return getMeterialProperty(material)
  }
}

/**
 * 创建自定义材质或原生材质
 * @param material - 原生材质
 * @param customMaterial - 自定义材质
 * @returns
 */
export function createMaterial(
  material?: Material | Color | string,
  customMaterial?: CustomMaterial
) {
  if (customMaterial) {
    return createCustomMaterial(customMaterial)
  } else {
    return getMeterial(material)
  }
}
