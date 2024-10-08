/*
 * @Author: zhouyinkui
 * @Date: 2024-01-02 15:31:44
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-08-07 10:16:07
 * @Description: 面Primitive
 */
import {
  Cartesian3,
  ClassificationType,
  Color,
  GeometryInstance,
  GroundPrimitive,
  Material,
  MaterialAppearance,
  PolygonGeometry,
  PolygonHierarchy,
  Primitive
} from 'cesium'
import { getMeterial } from '../../../material'
import {
  GeometryInstanceOption,
  GroundPrimitiveOption,
  PrimitiveOption
} from '..'
import { defaultColor } from '../../../defaultVal'

/**
 * PolygonGeometry构造参数
 */
type PolygonGeometryOption = Partial<
  ConstructorParameters<typeof PolygonGeometry>[0]
>

/**
 * 面Primitive构造参数
 * 混合 Primitive 和 GroundPrimitive 和 GeometryInstance 和 PolylineGeometry 的构造参数
 */
type PolygonPrimitiveOption = PrimitiveOption &
  GroundPrimitiveOption &
  GeometryInstanceOption &
  PolygonGeometryOption

/**
 * 面Primitive参数
 */
export interface PolygonOption extends PolygonPrimitiveOption {
  clampToGround?: boolean
  positions?: PolygonHierarchy | Cartesian3[]

  material?: Material | Color | string
  depthFailMaterial?: Material | Color | string
}

/**
 * 创建面Primitive对象，此方法会根据clampToGround创建不同的对象
 * @param options - 面参数
 * @returns
 */
export function createPolygon(options: PolygonOption) {
  const geometryInstances = new GeometryInstance({
    id: options.id,
    modelMatrix: options.modelMatrix,
    attributes: options.attributes,
    geometry: new PolygonGeometry({
      polygonHierarchy:
        options.positions instanceof PolygonHierarchy
          ? options.positions
          : new PolygonHierarchy(options.positions),
      height: options.height,
      extrudedHeight: options.extrudedHeight,
      vertexFormat: options.vertexFormat,
      stRotation: options.stRotation,
      ellipsoid: options.ellipsoid,
      granularity: options.granularity,
      perPositionHeight:
        options.perPositionHeight === undefined
          ? true
          : options.perPositionHeight,
      closeTop: options.closeTop,
      closeBottom: options.closeBottom,
      arcType: options.arcType,
      textureCoordinates: options.textureCoordinates
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
      depthFailAppearance: options.depthFailMaterial
        ? new MaterialAppearance({
            material: getMeterial(options.depthFailMaterial)
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
