/*
 * @Author: zhouyinkui
 * @Date: 2024-01-02 14:50:46
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-08 10:54:42
 * @Description: 线Primitive
 */
import {
  ClassificationType,
  Color,
  GeometryInstance,
  GroundPolylineGeometry,
  GroundPolylinePrimitive,
  Material,
  PolylineGeometry,
  PolylineMaterialAppearance,
  Primitive
} from 'cesium'
import { getMeterial } from '../../../material'
import { GeometryInstanceOption, PrimitiveOption } from '..'
import { defaultColor } from '../../../defaultVal'

/**
 * GroundPolylinePrimitive通用构造参数
 * 剔除appearance，geometryInstances属性
 */
type GroundPolylinePrimitiveOption = Omit<
  NonNullable<ConstructorParameters<typeof GroundPolylinePrimitive>[0]>,
  'appearance' | 'geometryInstances'
>

/**
 * GroundPolylineGeometry构造参数
 */
type GroundPolylineGeometryOption = Partial<
  ConstructorParameters<typeof GroundPolylineGeometry>[0]
>

/**
 * PolylineGeometry构造参数
 */
type PolylineGeometryOption = Partial<
  ConstructorParameters<typeof PolylineGeometry>[0]
>

/**
 * 线Primitive构造参数
 * 混合 Primitive 和 GroundPolylinePrimitive 和 GeometryInstance 和 GroundPolylineGeometry 和 PolylineGeometry 的构造参数
 */
type PolylinePrimitiveOption = PrimitiveOption &
  GroundPolylinePrimitiveOption &
  GeometryInstanceOption &
  GroundPolylineGeometryOption &
  PolylineGeometryOption

/**
 * 线Primitive参数
 */
export interface PolylineOption extends PolylinePrimitiveOption {
  clampToGround?: boolean
  material?: Material | Color | string
  depthFailMaterial?: Material | Color | string
}

/**
 * 创建线Primitive对象，此方法会根据clampToGround创建不同的对象
 * @param options - 线参数
 * @returns
 */
export function createPolyline(options: PolylineOption) {
  if (options.clampToGround) {
    return new GroundPolylinePrimitive({
      geometryInstances: new GeometryInstance({
        id: options.id,
        modelMatrix: options.modelMatrix,
        attributes: options.attributes,
        geometry: new GroundPolylineGeometry({
          positions: options.positions ?? [],
          width: options.width === undefined ? 2 : options.width,
          granularity: options.granularity,
          loop: options.loop,
          arcType: options.arcType
        })
      }),
      appearance: new PolylineMaterialAppearance({
        material: getMeterial(options.material ?? defaultColor)
      }),
      show: options.show === undefined ? true : options.show,
      interleave: options.interleave,
      releaseGeometryInstances: options.releaseGeometryInstances,
      allowPicking: options.allowPicking,
      asynchronous: options.asynchronous,
      classificationType: options.classificationType ?? ClassificationType.BOTH,
      debugShowBoundingVolume: options.debugShowBoundingVolume,
      debugShowShadowVolume: options.debugShowShadowVolume
    })
  } else {
    return new Primitive({
      geometryInstances: new GeometryInstance({
        id: options.id,
        modelMatrix: options.modelMatrix,
        attributes: options.attributes,
        geometry: new PolylineGeometry({
          positions: options.positions ?? [],
          width: options.width === undefined ? 2 : options.width,
          colors: options.colors,
          colorsPerVertex: options.colorsPerVertex,
          arcType: options.arcType,
          granularity: options.granularity,
          vertexFormat: options.vertexFormat,
          ellipsoid: options.ellipsoid
        })
      }),
      appearance: new PolylineMaterialAppearance({
        material: getMeterial(options.material ?? defaultColor)
      }),
      depthFailAppearance: new PolylineMaterialAppearance({
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
