/*
 * @Author: zhouyinkui
 * @Date: 2023-12-15 15:48:04
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-12-18 15:03:17
 * @Description: 3DTiles展示，配合TileConfigTool配置结果使用更佳
 */
import {
  Cartesian3,
  Cartographic,
  Ellipsoid,
  HeadingPitchRoll,
  Math,
  Matrix3,
  Matrix4,
  Quaternion,
  Transforms,
  PrimitiveCollection,
  Cesium3DTileset
} from 'cesium'
import { ToolBase, ToolBaseOptions } from '@mo-yu/core'
import { mapStoreTool } from '../storeTool'
import { CameraParam } from '../../mapViewAble'

/**
 * cesium原生3DTiles构造参数
 */
export type TilesetOption = ConstructorParameters<typeof Cesium3DTileset>[0]

/**
 * 3DTiles偏移、旋转，缩放参数
 */
export interface TilesTransform extends CameraParam {
  scale?: number
}

/**
 * 事件
 */
export interface MapTileToolEvents {}

/**
 * 3DTiles展示，配合TileConfigTool配置结果使用更佳
 * @example
 * ```ts
 * const tool = new MapTileTool({})
 *
 * tool.enable()
 * tool.add3DTileset({...})
 * ```
 */
export class MapTileTool<E extends MapTileToolEvents> extends ToolBase<
  ToolBaseOptions,
  E
> {
  protected tiles = new PrimitiveCollection()
  constructor(options: ToolBaseOptions) {
    super(options)
  }

  /**
   * 启用
   */
  enable(): void {
    this.mapView?.scene.primitives.add(this.tiles)
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.clear()
    this.mapView?.scene.primitives.remove(this.tiles)
  }

  /**
   * 清除所有3dTiles
   */
  clear() {
    this.#removeAllTiles()
  }

  /**
   * 根据id获取tile
   * @param id - 3DTiles Id
   * @returns
   */
  getTileById(id: string) {
    const len = this.tiles.length
    let tile: Cesium3DTileset | undefined
    for (let i = 0; i < len; i++) {
      const p = this.tiles.get(i)
      if (p.MoYuTileId === id) {
        tile = p
      }
    }
    return tile
  }

  /**
   * 定位3DTiles
   * @param id - 3DTiles Id
   */
  locateTile(id: string) {
    const tile = this.getTileById(id)
    if (tile) {
      this.mapView
        ?.flyTo(tile, {
          duration: 1
        })
        .catch(err => {
          console.error(err)
        })
    }
  }

  /**
   * 显隐3DTiles
   * @param id - 3DTiles Id
   * @param show - 显隐
   */
  toggleTile(id: string, show: boolean) {
    const tile = this.getTileById(id)
    if (tile) {
      tile.show = show
    }
  }

  /**
   * 添加3DTiles模型
   * @param option - Cesium3DTileset构造函数入参
   * @param params - 偏移旋转缩放
   * @param locate - 是否定位
   * @param id - 3DTiles Id
   */
  async add3DTileset(
    option: TilesetOption,
    params?: TilesTransform,
    locate?: boolean,
    id?: string
  ) {
    let primitive: any
    if (option) {
      const tileset = new Cesium3DTileset(option)
      const tile = await tileset.readyPromise
      if (params) {
        const modelMatrix = this.getTransform(tile.root.transform, params)
        tile.root.transform = modelMatrix
      }
      if (id) {
        ;(tile as any).MoYuTileId = id
      }
      primitive = this.tiles.add(tile)
      if (locate) {
        await this.mapView?.zoomTo(tile)
      }
    }
    return primitive
  }

  protected getTransform(mat: Matrix4, params: TilesTransform) {
    const data = this.getPosiHPRScale(mat)
    const translation = this.updateTranslation(data[0], params)
    const hpr = this.updateHPR(data[1], params)
    const scale = this.createScale(params.scale)
    const modelMatrix = this.createMatrix(translation, hpr, scale)
    return modelMatrix
  }

  protected updateTranslation(prev: Cartesian3, params: TilesTransform) {
    const cartographic = Cartographic.fromCartesian(prev)
    const translation = Cartesian3.fromDegrees(
      this.getDegree(cartographic.longitude, params.lng),
      this.getDegree(cartographic.latitude, params.lat),
      params.height !== undefined ? params.height : cartographic.height
    )
    return translation
  }

  protected updateHPR(prev: HeadingPitchRoll, params: TilesTransform) {
    const hpr = new HeadingPitchRoll(
      Math.toRadians(this.getDegree(prev.heading, params.heading)),
      Math.toRadians(this.getDegree(prev.pitch, params.pitch)),
      Math.toRadians(this.getDegree(prev.roll, params.roll))
    )
    return hpr
  }

  protected createScale(scaleXYZ?: number) {
    const x = scaleXYZ !== undefined ? scaleXYZ : 1
    const scale = new Cartesian3(x, x, x)
    return scale
  }

  protected createMatrix(
    translation: Cartesian3,
    hpr: HeadingPitchRoll,
    scale: Cartesian3
  ) {
    const modelMatrix = Transforms.headingPitchRollToFixedFrame(
      translation,
      hpr,
      Ellipsoid.WGS84,
      Transforms.eastNorthUpToFixedFrame,
      new Matrix4()
    )
    Matrix4.multiplyByScale(modelMatrix, scale, modelMatrix)
    return modelMatrix
  }

  protected getPosiHPRScale(
    mat: Matrix4
  ): [Cartesian3, HeadingPitchRoll, Cartesian3] {
    const scale = Matrix4.getScale(mat, new Cartesian3())
    const translation = Matrix4.getTranslation(mat, new Cartesian3())
    const m1 = Transforms.eastNorthUpToFixedFrame(
      translation,
      Ellipsoid.WGS84,
      new Matrix4()
    )
    const m3 = Matrix4.multiply(
      Matrix4.inverse(m1, new Matrix4()),
      mat,
      new Matrix4()
    )
    const mat3 = Matrix4.getRotation(m3, new Matrix3())
    const q = Quaternion.fromRotationMatrix(mat3)
    const hpr = HeadingPitchRoll.fromQuaternion(q)
    const headingPitchRoll = new HeadingPitchRoll(
      hpr.heading,
      hpr.pitch,
      hpr.roll
    )
    return [translation, headingPitchRoll, scale]
  }

  protected getDegree(prev: number, next?: number) {
    return next !== undefined ? next : Math.toDegrees(prev)
  }

  protected get mapView() {
    return mapStoreTool.getMap()?.viewer
  }

  #removeAllTiles() {
    this.tiles.removeAll()
  }
}
