/*
 * @Author: zhouyinkui
 * @Date: 2023-12-15 15:48:04
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-19 19:41:57
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
  Cesium3DTileset,
  ShadowMode,
  Cesium3DTileStyle,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Cesium3DTileFeature,
  Color
} from 'cesium'
import {
  ToolBase,
  ToolBaseOptions,
  getDefault,
  guid,
  debounce
} from '@mo-yu/core'
import { mapStoreTool } from '../storeTool'
import { CameraParam } from '../cameraTool'
import { defaultColor } from '../../core/defaultVal'
import { getColor } from '../../core'

/**
 * cesium原生3DTiles构造参数
 */
type TilesetOption = ConstructorParameters<typeof Cesium3DTileset>[0]

/**
 * 3DTiles偏移、旋转，缩放参数
 */
export interface TilesTransform extends CameraParam {
  scale?: number
}

/**
 * 简单色例参数
 */
export interface Cesium3DTileColor {
  value: any
  label: string
  color: string
}

/**
 * 添加3DTiles图层所需参数，除了Cesium3DTileset需要的原生参数，还添加了
 * id: 唯一标识
 * locate: 是否定位
 * lng: 精度
 * lat: 纬度
 * height: 高度
 * heading: 偏航角
 * pitch: 俯仰角
 * roll: 翻滚角
 * scale: 缩放（默认1）
 */
export type TileOption = TilesetOption &
  TilesTransform & {
    id?: string
    locate?: boolean
    /**
     * 组装Cesium3DTileStyle，必须是合法的Cesium3DTileStyle入参
     */
    style?: {
      [key: string]: any
      /**
       * 整体颜色，存在colorAll则忽略paramName和colorList
       */
      colorAll?: string
      /**
       * 组装到color.conditions
       */
      paramName?: string
      colorList?: Cesium3DTileColor[]
    }
    /**
     * 选中时Cesium3DTileFeature的样式
     */
    pick?: PickTileFeatureStyle
  }

/**
 * 选中时Cesium3DTileFeature的样式
 */
export interface PickTileFeatureStyle {
  hover?: {
    color: Color | string
  }
  click?: {
    color: Color | string
  }
}

/**
 * 事件
 */
export interface MapTileToolEvents {
  /**
   * 选中feature
   */
  'pick-fea': {
    properties: any
  }
  'pick-fea-all': {
    properties: any[]
  }
  /**
   * 鼠标悬浮于feature上
   */
  'hover-fea': {
    properties: any
  }
  'hover-fea-all': {
    properties: any[]
  }
}

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
export class MapTileTool<
  E extends MapTileToolEvents = MapTileToolEvents
> extends ToolBase<ToolBaseOptions, E> {
  protected tiles = new PrimitiveCollection()
  #handler: ScreenSpaceEventHandler | undefined
  #pickStyles: Map<string, PickTileFeatureStyle> = new Map()
  #prevClickColor: Color | undefined
  #prevClickFea: Cesium3DTileFeature | undefined
  #prevHoverColor: Color | undefined
  #prevHoverFea: Cesium3DTileFeature | undefined
  constructor(options: ToolBaseOptions) {
    super(options)
  }

  /**
   * 启用
   */
  enable(): void {
    if (this.viewer) {
      const viewer = this.viewer
      viewer.scene.primitives.add(this.tiles)
      this.#handler = new ScreenSpaceEventHandler(viewer.canvas)
      this.#handler.setInputAction(
        this.#handleClick,
        ScreenSpaceEventType.LEFT_CLICK
      )
      this.#handler.setInputAction(
        this.#handleMove,
        ScreenSpaceEventType.MOUSE_MOVE
      )
    }
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.clear()
    this.viewer?.scene.primitives.remove(this.tiles)
    this.#handler?.destroy()
  }

  /**
   * 清除所有3dTiles
   */
  clear() {
    this.#removeAllTiles()
    this.#pickStyles.clear()
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
      this.viewer
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
   * 移除3DTiles
   * @param id - 3DTiles Id
   */
  removeTile(id: string) {
    const tile = this.getTileById(id)
    if (tile) {
      this.tiles.remove(tile)
    }
  }

  /**
   * 添加3DTiles模型
   * @param option - TileOption
   */
  async add3DTileset(option: TileOption) {
    let primitive: any
    if (option) {
      const {
        id,
        locate,
        lng,
        lat,
        height,
        heading,
        pitch,
        roll,
        scale,
        ...rest
      } = option
      const MoYuTileId = id ?? guid()
      const tileset = new Cesium3DTileset(
        getDefault(
          {
            url: '',
            backFaceCulling: true,
            maximumScreenSpaceError: 16,
            maximumMemoryUsage: 512,
            cullWithChildrenBounds: true,
            dynamicScreenSpaceError: false,
            dynamicScreenSpaceErrorDensity: 0.00278,
            dynamicScreenSpaceErrorFactor: 4,
            dynamicScreenSpaceErrorHeightFalloff: 0.25,
            skipLevelOfDetail: true,
            baseScreenSpaceError: 1024,
            skipScreenSpaceErrorFactor: 16,
            skipLevels: 1,
            immediatelyLoadDesiredLevelOfDetail: false,
            loadSiblings: false,
            shadows: ShadowMode.ENABLED
          },
          rest
        )
      )
      const tile = await tileset.readyPromise
      this.#handleStyle(option, tile)
      this.#handlePickStyle(option, MoYuTileId)
      const modelMatrix = this.getTransform(tile.root.transform, {
        lng,
        lat,
        height,
        heading,
        pitch,
        roll,
        scale
      })
      tile.root.transform = modelMatrix
      ;(tile as any).MoYuTileId = MoYuTileId
      primitive = this.tiles.add(tile)
      if (locate) {
        await this.viewer?.zoomTo(tile)
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

  protected get viewer() {
    return mapStoreTool.getMap()?.viewer
  }

  #handleStyle(option: TileOption, tileset: Cesium3DTileset) {
    if (option.style) {
      const { colorAll, colorList, paramName, ...rest } = option.style
      if (colorAll) {
        rest.color = `color('${colorAll}')`
      } else if (colorList?.length && paramName && rest.color === undefined) {
        rest.color = {
          conditions: colorList.map(c => {
            let cond = '${' + paramName + '} === '
            if (typeof c.value === 'string') {
              cond = `${cond}'${c.value}'`
            } else {
              cond = `${cond}${c.value}`
            }
            if (c.value === true || c.value === 'true') {
              cond = 'true'
            }
            return [
              cond,
              `color('${c.color ?? defaultColor.toCssColorString()}')`
            ]
          })
        }
      }
      tileset.style = new Cesium3DTileStyle(rest)
    }
  }

  #handlePickStyle(option: TileOption, tileId: string) {
    if (option.pick) {
      this.#pickStyles.set(tileId, option.pick)
    }
  }

  #handleMove = (event: ScreenSpaceEventHandler.MotionEvent) => {
    const picked = this.viewer?.scene.drillPick(event.endPosition)
    if (picked?.length) {
      const features = picked.filter(p => p instanceof Cesium3DTileFeature)
      if (features.length) {
        const feature = features[0]
        const tileset = feature.tileset
        const tileId = tileset.MoYuTileId
        const pickColor = getColor(this.#pickStyles.get(tileId)?.hover?.color)
        if (pickColor) {
          if (
            feature !== this.#prevHoverFea &&
            feature !== this.#prevClickFea
          ) {
            if (this.#prevHoverFea && this.#prevHoverColor) {
              this.#prevHoverFea.color = this.#prevHoverColor
            }
            this.#prevHoverFea = feature
            this.#prevHoverColor = feature.color.clone()
            feature.color = pickColor
          }
        }
        const properties = features.map(f => {
          const MoYuTileId = f.tileset.MoYuTileId
          const properties: any = { MoYuTileId }
          const propertyIds: string[] = f.getPropertyIds()
          propertyIds.forEach(propertyId => {
            properties[propertyId] = f.getProperty(propertyId)
          })
          return properties
        })
        this.eventBus.fire('hover-fea', { properties: properties[0] })
        this.eventBus.fire('hover-fea-all', { properties })
      } else {
        if (this.#prevHoverFea && this.#prevHoverColor) {
          this.#prevHoverFea.color = this.#prevHoverColor
          this.#prevHoverFea = undefined
          this.#prevHoverColor = undefined
        }
      }
    }
  }

  #handleClick = debounce((event: ScreenSpaceEventHandler.PositionedEvent) => {
    const picked = this.viewer?.scene.drillPick(event.position)
    if (picked?.length) {
      const features = picked.filter(p => p instanceof Cesium3DTileFeature)
      if (features.length) {
        const feature = features[0]
        const tileset = feature.tileset
        const tileId = tileset.MoYuTileId
        const pickColor = getColor(this.#pickStyles.get(tileId)?.click?.color)
        if (pickColor) {
          if (feature !== this.#prevClickFea) {
            if (this.#prevClickFea && this.#prevClickColor) {
              this.#prevClickFea.color = this.#prevClickColor
            }
            if (feature === this.#prevHoverFea && this.#prevHoverColor) {
              this.#prevClickColor = this.#prevHoverColor
            } else {
              this.#prevClickColor = feature.color.clone()
            }
            this.#prevClickFea = feature
            feature.color = pickColor
          }
        }
        const properties = features.map(f => {
          const MoYuTileId = f.tileset.MoYuTileId
          const properties: any = { MoYuTileId }
          const propertyIds: string[] = f.getPropertyIds()
          propertyIds.forEach(propertyId => {
            properties[propertyId] = f.getProperty(propertyId)
          })
          return properties
        })
        this.eventBus.fire('pick-fea', { properties: properties[0] })
        this.eventBus.fire('pick-fea-all', { properties })
      } else {
        if (this.#prevClickFea && this.#prevClickColor) {
          this.#prevClickFea.color = this.#prevClickColor
          this.#prevClickFea = undefined
          this.#prevClickColor = undefined
        }
      }
    }
  })

  #removeAllTiles() {
    this.tiles.removeAll()
  }
}
