/*
 * @Author: zhouyinkui
 * @Date: 2024-01-04 17:19:02
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-05 14:34:06
 * @Description: 圆Primitive
 */
import {
  Cartesian3,
  ClassificationType,
  Color,
  GeometryInstance,
  GroundPrimitive,
  Material,
  MaterialAppearance,
  CircleGeometry,
  Primitive
} from 'cesium'
import { getMeterial } from '../../material'
import {
  GeometryInstanceOption,
  GroundPrimitiveOption,
  PrimitiveOption
} from '..'

/**
 * CircleGeometry构造参数
 */
export type CircleGeometryOption = Partial<
  ConstructorParameters<typeof CircleGeometry>[0]
>

/**
 * 圆Primitive构造参数
 * 混合 Primitive 和 GroundPrimitive 和 GeometryInstance 和 CircleGeometry 的构造参数
 */
export type CirclePrimitiveOption = PrimitiveOption &
  GroundPrimitiveOption &
  GeometryInstanceOption &
  CircleGeometryOption

/**
 * 圆Primitive参数
 */
export interface CircleOption extends CirclePrimitiveOption {
  clampToGround?: boolean

  material?: Material | Color | string
  depthFailMaterial?: Material | Color | string
}

/**
 * 创建圆Primitive对象，此方法会根据heightReference创建不同的对象
 * @param options - 圆参数
 * @returns
 */
export function createCircle(options: CircleOption) {
  const defaultColor = Color.LIGHTBLUE
  const geometryInstances = new GeometryInstance({
    id: options.id,
    modelMatrix: options.modelMatrix,
    attributes: options.attributes,
    geometry: new CircleGeometry({
      center:
        options.center ?? Cartesian3.fromDegrees(116.397497, 39.906888, 0),
      radius: options.radius ?? 1000,
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
  if (options.clampToGround) {
    return new GroundPrimitive({
      geometryInstances,
      appearance,
      show: options.show === undefined ? true : options.show,
      vertexCacheOptimize: options.vertexCacheOptimize,
      interleave: options.interleave,
      compressVertices: options.compressVertices,
      releaseGeometryInstances: options.releaseGeometryInstances,
      allowPicking: options.allowPicking,
      asynchronous: options.asynchronous,
      classificationType: options.classificationType ?? ClassificationType.BOTH,
      debugShowBoundingVolume: options.debugShowBoundingVolume,
      debugShowShadowVolume: options.debugShowShadowVolume
    })
  } else {
    return new Primitive({
      geometryInstances,
      appearance,
      depthFailAppearance: new MaterialAppearance({
        material: getMeterial(options.depthFailMaterial ?? defaultColor)
      }),
      show: options.show === undefined ? true : options.show,
      modelMatrix: options.modelMatrix,
      vertexCacheOptimize: options.vertexCacheOptimize,
      interleave: options.interleave,
      compressVertices: options.compressVertices,
      releaseGeometryInstances: options.releaseGeometryInstances,
      allowPicking: options.allowPicking,
      cull: options.cull,
      asynchronous: options.asynchronous,
      debugShowBoundingVolume: options.debugShowBoundingVolume,
      shadows: options.shadows
    })
  }
}
