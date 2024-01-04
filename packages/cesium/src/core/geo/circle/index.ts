/*
 * @Author: zhouyinkui
 * @Date: 2024-01-04 17:19:02
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-04 18:56:46
 * @Description: 圆Primitive
 */
import {
  Cartesian3,
  ClassificationType,
  Color,
  GeometryInstance,
  GroundPrimitive,
  HeightReference,
  Material,
  MaterialAppearance,
  CircleGeometry,
  Primitive,
  ShadowMode,
  Ellipsoid,
  VertexFormat
} from 'cesium'
import { getMeterial } from '../../material'

/**
 * 圆Primitive参数
 */
export interface CircleOption {
  id?: string
  heightReference?: HeightReference

  center?: Cartesian3
  radius?: number
  ellipsoid?: Ellipsoid
  height?: number
  granularity?: number
  vertexFormat?: VertexFormat
  extrudedHeight?: number
  stRotation?: number

  show?: boolean
  classificationType?: ClassificationType
  material?: Material | Color
  depthFailMaterial?: Material | Color
  shadows?: ShadowMode
}

/**
 * 创建圆Primitive对象，此方法会根据heightReference创建不同的对象
 * @param options - 圆参数
 * @returns
 */
export function createCircle(options: CircleOption) {
  const defaultColor = Color.BLUE
  const geometryInstances = new GeometryInstance({
    id: options.id,
    geometry: new CircleGeometry({
      center: options.center ?? Cartesian3.ONE,
      radius: options.radius ?? 0,
      ellipsoid: options.ellipsoid,
      height: options.height,
      granularity: options.granularity,
      vertexFormat: options.vertexFormat,
      extrudedHeight: options.extrudedHeight,
      stRotation: options.stRotation
    })
  })
  const appearance = new MaterialAppearance({
    material: getMeterial(options.material ?? defaultColor)
  })
  if (options.heightReference === HeightReference.CLAMP_TO_GROUND) {
    return new GroundPrimitive({
      show: options.show === undefined ? true : options.show,
      geometryInstances,
      classificationType: options.classificationType ?? ClassificationType.BOTH,
      appearance
    })
  } else {
    return new Primitive({
      show: options.show === undefined ? true : options.show,
      geometryInstances,
      appearance,
      depthFailAppearance: new MaterialAppearance({
        material: getMeterial(options.depthFailMaterial ?? defaultColor)
      }),
      shadows: options.shadows
    })
  }
}
