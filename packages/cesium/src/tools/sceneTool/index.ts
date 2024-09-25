/*
 * @Author: zhouyinkui
 * @Date: 2023-12-29 14:38:10
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-09-25 17:40:38
 * @Description: 地图场景初始化工具
 */
import { debounce, ToolBase, ToolBaseOptions } from '@mo-yu/core'
import {
  Cesium3DTileFeature,
  Entity,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType
} from 'cesium'
import { mapStoreTool } from '../storeTool'
import { ResourceConfig, resourceTool } from '../resourceTool'
import { CameraParam, MapCameraTool } from '../cameraTool'
import { TileOption, MapTileTool } from '../tileTool'
import { GeoOption, MapGeoTool } from '../geoTool'
import { BaseMapTryConfig, BaseMapTool, TerrainConfig } from '../baseMapTool'
import { MaskPrimitiveOption, MapMaskTool } from '../mapMaskTool'
import { FlyConfig, MapFlyTool } from '../flyTool'
import { HeatMapTool } from '../heatMapTool'
import { PointsTool } from '../pointsTool'

/**
 * 场景配置
 */
export interface SceneConfig {
  /**
   * 静态资源列表
   */
  resource?: ResourceConfig[]
  /**
   * 初始视角
   */
  initCamera?: CameraParam
  /**
   * 视角变化
   */
  camera?: CameraParam
  /**
   * 飞行参数
   */
  fly?: FlyConfig
  /**
   * 场景中默认3dTiles
   */
  tiles?: TileOption[]
  /**
   * 场景中默认矢量
   */
  geos?: GeoOption[]
  /**
   * 默认底图
   */
  baseMap?: BaseMapTryConfig
  /**
   * 默认地形
   */
  terrain?: TerrainConfig
  /**
   * 遮罩
   */
  mask?: MaskPrimitiveOption
}

/**
 * 场景参数
 */
interface MapSceneToolOptions extends ToolBaseOptions {
  config?: SceneConfig
}

/**
 * 场景事件
 */
interface MapSceneToolEvents {
  /**
   * 选取所有fea属性
   */
  'pick-all': {
    properties: any[]
  }
  /**
   * 选取所有fea属性
   */
  'hover-all': {
    properties: any[]
  }
  /**
   * 双击选取所有fea属性
   */
  'double-click-all': {
    properties: any[]
  }
}

/**
 * 初始化场景
 * @example
 * ```ts
 * const tool = new MapSceneTool({})
 *
 * tool.enable()
 * tool.prepareScene(config, 1)
 * ```
 */
export class MapSceneTool extends ToolBase<
  MapSceneToolOptions,
  MapSceneToolEvents
> {
  #config: SceneConfig | undefined
  #handler: ScreenSpaceEventHandler | undefined
  camera: MapCameraTool
  tile: MapTileTool
  geo: MapGeoTool
  baseMap: BaseMapTool
  mask: MapMaskTool
  fly: MapFlyTool
  heat: HeatMapTool
  points: PointsTool
  constructor(options: MapSceneToolOptions) {
    super(options)
    this.#config = options.config
    this.camera = new MapCameraTool({})
    this.tile = new MapTileTool({})
    this.geo = new MapGeoTool({})
    this.baseMap = new BaseMapTool({})
    this.mask = new MapMaskTool({})
    this.fly = new MapFlyTool({})
    this.heat = new HeatMapTool({})
    this.points = new PointsTool({})
  }

  /**
   * 启用
   */
  enable(): void {
    this.camera.enable()
    this.tile.enable()
    this.geo.enable()
    this.baseMap.enable()
    this.mask.enable()
    this.fly.enable()
    this.heat.enable()
    this.points.enable()
    if (this.#viewer) {
      this.#handler = new ScreenSpaceEventHandler(this.#viewer.canvas)
      this.#handler.setInputAction(
        this.#handleClick,
        ScreenSpaceEventType.LEFT_CLICK
      )
      this.#handler.setInputAction(
        this.#handleMove,
        ScreenSpaceEventType.MOUSE_MOVE
      )
      this.#handler.setInputAction(
        this.#handleDBClick,
        ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      )
    }
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.camera.destroy()
    this.tile.destroy()
    this.geo.destroy()
    this.baseMap.destroy()
    this.mask.destroy()
    this.fly.destroy()
    this.heat.destroy()
    this.points.destroy()
    this.#handler?.destroy()
  }

  /**
   * 清空当前场景图层
   */
  clear() {
    this.tile.clear()
    this.geo.clear()
    this.baseMap.clear()
    this.mask.clear()
    this.fly.clear()
    this.heat.clear()
    this.points.clear()
  }

  prepareScene(config?: SceneConfig, duration = 0) {
    this.#config = config
    // this.clear()
    if (config) {
      if (config.resource?.length) {
        resourceTool.initResource(config.resource)
      }
      if (config.tiles?.length) {
        const promises = config.tiles.map(t => this.tile.add3DTileset(t))
        Promise.allSettled(promises).catch(err => {
          console.error(err)
        })
      }
      if (config.geos?.length) {
        config.geos.forEach(g => {
          this.geo.addGeo(g)
        })
      }
      if (config.baseMap) {
        this.baseMap.tryImagery(config.baseMap)
      }
      if (config.terrain) {
        this.baseMap.addTerrain(config.terrain)
      }
      if (config.mask) {
        this.mask.addMask(config.mask)
      }
      if (config.fly) {
        this.fly.initRoute(config.fly.route, config.fly.handleHeading)
        this.fly.play()
      } else if (config.camera) {
        this.camera.flyTo(config.camera, duration)
      }
    }
  }

  #handleProperties(picked: any[]) {
    const pickedProperties: any[] = []
    if (picked?.length) {
      picked.forEach(p => {
        let properties: any = {}
        if (p instanceof Cesium3DTileFeature) {
          const MoYuTileId = (p.tileset as any).MoYuTileId
          properties.MoYuTileId = MoYuTileId
          const propertyIds: string[] = p.getPropertyIds()
          propertyIds.forEach(propertyId => {
            properties[propertyId] = p.getProperty(propertyId)
          })
          pickedProperties.push(properties)
        } else if (p.id instanceof Entity) {
          const entity: Entity = p.id
          entity.properties?.propertyNames?.forEach((str: string) => {
            properties[str] = entity.properties?.[str]?._value
          })
          pickedProperties.push(properties)
        } else if (p.id?.startsWith?.(`${PointsTool.prefix}#`)) {
          const arr = p.id.split('#')
          const temp = this.points.getPointsById(arr[1])
          const fea = temp?.points?.[arr[2]]
          if (fea) {
            properties = fea.properties
          }
          pickedProperties.push(properties)
        }
      })
    }
    return pickedProperties
  }

  #handleClick = debounce((event: ScreenSpaceEventHandler.PositionedEvent) => {
    const picked = this.#viewer?.scene.drillPick(event.position)
    const properties = this.#handleProperties(picked)
    this.eventBus.fire('pick-all', {
      properties
    })
  })

  #handleMove = (event: ScreenSpaceEventHandler.MotionEvent) => {
    const picked = this.#viewer?.scene.drillPick(event.endPosition)
    const properties = this.#handleProperties(picked)
    this.eventBus.fire('hover-all', {
      properties
    })
  }

  #handleDBClick = debounce(
    (event: ScreenSpaceEventHandler.PositionedEvent) => {
      const picked = this.#viewer?.scene.drillPick(event.position)
      const properties = this.#handleProperties(picked)
      this.eventBus.fire('double-click-all', {
        properties
      })
    }
  )

  get config() {
    return this.#config
  }

  get #viewer() {
    return mapStoreTool.getMap()?.viewer
  }
}
