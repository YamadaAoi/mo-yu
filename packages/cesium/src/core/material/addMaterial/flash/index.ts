/*
 * @Author: zhouyinkui
 * @Date: 2024-01-16 16:28:30
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-16 17:10:48
 * @Description:
 */
import { Color, Material, JulianDate, defined, Property } from 'cesium'
import { getColor } from '../..'
import { CustomMaterialProperty } from '..'

const P: any = Property

/**
 * 闪烁材质参数
 */
export interface FlashMaterialOptions {
  image?: string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
  color?: string | Color
  speed?: number
  vertical?: boolean
  /**
   * 纹理由色带绘制
   */
  colors?: string[]
}

const defaultImage = Material.DefaultImageId
const defaultColor = new Color(1.0, 1.0, 1.0, 1.0)
const defaultSpeed = 1
const defaultOrient = 0

/**
 * 流动材质Property
 */
export class FlashMaterialProperty extends CustomMaterialProperty {
  private _image?:
    | string
    | HTMLImageElement
    | HTMLCanvasElement
    | HTMLVideoElement
  private _color?: Color
  private _speed?: number
  private _orient?: number
  private _imageSubscription: any
  private _colorSubscription: any
  private _speedSubscription: any
  private _orientSubscription: any
  constructor(options: FlashMaterialOptions) {
    super()
    this.image = options.image ?? defaultImage
    this.color = getColor(options.color) ?? defaultColor
    this.speed = options.speed ?? defaultSpeed
    this.orient = options.vertical ? 1 : 0
  }

  getType() {
    return 'Flash'
  }

  getValue(time: JulianDate, result: any) {
    if (!defined(result)) {
      result = {}
    }
    result.image = P.getValueOrUndefined(this._image, time)
    result.color = P.getValueOrClonedDefault(
      this._color,
      time,
      defaultColor,
      result.color
    )
    result.speed = P.getValueOrDefault(this._speed, time, defaultSpeed)
    result.orient = P.getValueOrDefault(this._orient, time, defaultOrient)
    return result
  }

  equals(other: any) {
    return (
      this === other ||
      (other instanceof FlashMaterialProperty &&
        P.equals(this._color, other._color) &&
        P.equals(this._image, other._image) &&
        P.equals(this._speed, other._speed) &&
        P.equals(this._orient, other._orient))
    )
  }

  get image() {
    return this._image
  }

  set image(
    value:
      | string
      | HTMLImageElement
      | HTMLCanvasElement
      | HTMLVideoElement
      | undefined
  ) {
    this.createProperty('image', value)
  }

  get color() {
    return this._color
  }

  set color(value: Color | undefined) {
    this.createProperty('color', value)
  }

  get speed() {
    return this._speed
  }

  set speed(value: number | undefined) {
    this.createProperty('speed', value)
  }

  get orient() {
    return this._orient
  }

  set orient(value: number | undefined) {
    this.createProperty('orient', value)
  }

  get isConstant() {
    return (
      P.isConstant(this.image) &&
      P.isConstant(this.color) &&
      P.isConstant(this.speed) &&
      P.isConstant(this.orient)
    )
  }
}

/**
 * 添加闪烁纹理
 */
export function addFlashMaterial() {
  // Flash
  ;(Material as any)._materialCache.addMaterial('Flash', {
    fabric: {
      type: 'Flash',
      uniforms: {
        image: Material.DefaultImageId,
        color: new Color(1.0, 1.0, 1.0, 1.0),
        speed: 1,
        /**
         * 方向
         * 0: 水平方向
         * 大于0: 垂直方向
         */
        orient: 1
      },
      source: /*glsl*/ `czm_material czm_getMaterial(czm_materialInput materialInput)
      {
        czm_material material = czm_getDefaultMaterial(materialInput);
        vec2 st = materialInput.st;
        vec4 colorImage = texture2D(image, st);
        float curA = abs(color.a * sin(speed * czm_frameNumber / 1000.0));
        material.alpha = colorImage.a * curA;
        material.diffuse = (colorImage.rgb + color.rgb) / 2.0;
        return material;
      }`
    },
    translucent: true
  })
}
