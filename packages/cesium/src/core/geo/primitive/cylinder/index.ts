/*
 * @Author: zhouyinkui
 * @Date: 2024-04-08 16:54:47
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-04-11 19:13:04
 * @Description: 圆柱
 */
import {
  Cartesian3,
  ClassificationType,
  Color,
  GeometryInstance,
  GroundPrimitive,
  Material,
  MaterialAppearance,
  Primitive,
  CylinderGeometry,
  Transforms,
  Appearance
} from 'cesium'
import { CustomMaterial, createMaterial, getMeterial } from '../../../material'
import {
  GeometryInstanceOption,
  GroundPrimitiveOption,
  PrimitiveOption
} from '..'
import { defaultColor } from '../../../defaultVal'

/**
 * CylinderGeometry构造参数
 */
type CylinderGeometryOption = Partial<
  ConstructorParameters<typeof CylinderGeometry>[0]
>

/**
 * Cylinder构造参数
 * 混合 Primitive 和 GeometryInstance 和 CylinderGeometry 的构造参数
 */
type CylinderPrimitiveOption = PrimitiveOption &
  GroundPrimitiveOption &
  GeometryInstanceOption &
  CylinderGeometryOption

/**
 * Cylinder Primitive参数
 */
export interface CylinderOption extends CylinderPrimitiveOption {
  clampToGround?: boolean
  position?: Cartesian3

  appearance?: Appearance
  depthFailAppearance?: Appearance
  material?: Material | Color | string
  customMaterial?: CustomMaterial
  depthFailMaterial?: Material | Color | string
  customDepthFailMaterial?: CustomMaterial
}

/**
 * 创建Cylinder Primitive对象，此方法会根据clampToGround创建不同的对象
 * @param options - Cylinder参数
 * @returns
 */
export function createCylinder(options: CylinderOption) {
  const geometryInstances = new GeometryInstance({
    id: options.id,
    modelMatrix: options.position
      ? Transforms.eastNorthUpToFixedFrame(options.position)
      : options.modelMatrix,
    attributes: options.attributes,
    geometry: new CylinderGeometry({
      length: options.length ?? 500,
      topRadius: options.topRadius ?? 50,
      bottomRadius: options.bottomRadius ?? 50,
      slices: options.slices,
      vertexFormat: options.vertexFormat
    })
  })
  const appearance =
    options.appearance ??
    new MaterialAppearance({
      material: createMaterial(
        options.material ?? defaultColor,
        options.customMaterial
      )
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
      depthFailAppearance:
        options.depthFailAppearance ??
        (options.depthFailMaterial || options.customDepthFailMaterial)
          ? new MaterialAppearance({
              material: createMaterial(
                options.depthFailMaterial,
                options.customDepthFailMaterial
              )
            })
          : undefined,
      show: options.show === undefined ? true : options.show,
      modelMatrix: options.primitiveModelMatrix,
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
