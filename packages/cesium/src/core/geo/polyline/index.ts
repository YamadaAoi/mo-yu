/*
 * @Author: zhouyinkui
 * @Date: 2024-01-02 14:50:46
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-03 13:49:38
 * @Description: 线Primitive
 */
import {
  ArcType,
  Cartesian3,
  ClassificationType,
  Color,
  GeometryInstance,
  GroundPolylineGeometry,
  GroundPolylinePrimitive,
  Material,
  PolylineGeometry,
  PolylineMaterialAppearance,
  Primitive,
  ShadowMode,
  VertexFormat
} from 'cesium'
import { getMeterial } from '../../material'

/**
 * 线Primitive参数
 */
export interface PolylineOption {
  positions?: Cartesian3[]
  id?: string
  show?: boolean
  width?: number
  granularity?: number
  vertexFormat?: VertexFormat
  material?: Material | Color
  depthFailMaterial?: Material | Color
  arcType?: ArcType
  clampToGround?: boolean
  shadows?: ShadowMode
  classificationType?: ClassificationType
}

/**
 * 创建线Primitive对象，此方法会根据clampToGround创建不同的对象
 * @param options - 线参数
 * @returns
 */
export function createPolyline(options: PolylineOption) {
  const defaultColor = Color.BLUE
  if (options.clampToGround) {
    return new GroundPolylinePrimitive({
      show: options.show === undefined ? true : options.show,
      geometryInstances: new GeometryInstance({
        id: options.id,
        geometry: new GroundPolylineGeometry({
          positions: options.positions ?? [],
          width: options.width === undefined ? 2 : options.width,
          granularity: options.granularity,
          arcType: options.arcType
        })
      }),
      classificationType: options.classificationType ?? ClassificationType.BOTH,
      appearance: new PolylineMaterialAppearance({
        material: getMeterial(options.material ?? defaultColor)
      })
    })
  } else {
    return new Primitive({
      show: options.show === undefined ? true : options.show,
      geometryInstances: new GeometryInstance({
        id: options.id,
        geometry: new PolylineGeometry({
          positions: options.positions ?? [],
          width: options.width === undefined ? 2 : options.width,
          granularity: options.granularity,
          arcType: options.arcType,
          vertexFormat: options.vertexFormat
        })
      }),
      appearance: new PolylineMaterialAppearance({
        material: getMeterial(options.material ?? defaultColor)
      }),
      depthFailAppearance: new PolylineMaterialAppearance({
        material: getMeterial(options.depthFailMaterial ?? defaultColor)
      }),
      shadows: options.shadows
    })
  }
}
