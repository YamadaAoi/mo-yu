/*
 * @Author: zhouyinkui
 * @Date: 2024-01-15 14:22:26
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-08-05 13:49:34
 * @Description:
 */
import { Color, Material, JulianDate, defined, Property } from 'cesium'
import { getColor } from '../..'
import { CustomMaterialProperty } from '..'

const P: any = Property

/**
 * 流动材质参数
 */
export interface FlowMaterialOptions {
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
export class FlowMaterialProperty extends CustomMaterialProperty {
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
  constructor(options: FlowMaterialOptions) {
    super()
    this.image = options.image ?? defaultImage
    this.color = getColor(options.color) ?? defaultColor
    this.speed = options.speed ?? defaultSpeed
    this.orient = options.vertical ? 1 : 0
  }

  getType() {
    return 'Flow'
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
      (other instanceof FlowMaterialProperty &&
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
 * 添加流动纹理
 */
export function addFlowMaterial() {
  // Flow
  ;(Material as any)._materialCache.addMaterial('Flow', {
    fabric: {
      type: 'Flow',
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
        vec4 colorImage;
        if(orient > 0.0) {
          colorImage = texture(image, vec2(fract(st.s), fract(st.t - speed * czm_frameNumber / 1000.0)));
        } else {
          colorImage = texture(image, vec2(fract(st.s - speed * czm_frameNumber / 100.0), fract(st.t)));
        }
        material.alpha = colorImage.a * color.a;
        material.diffuse = (colorImage.rgb + color.rgb) / 2.0;
        return material;
      }`
    },
    translucent: true
  })
}
