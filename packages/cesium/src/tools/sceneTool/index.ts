/*
 * @Author: zhouyinkui
 * @Date: 2023-12-29 14:38:10
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-26 20:49:31
 * @Description: 地图场景初始化工具
 */
import { ToolBase, ToolBaseOptions } from '@mo-yu/core'
import { CameraParam, MapCameraTool, MapCameraToolEvents } from '../cameraTool'
import { TileOption, MapTileTool, MapTileToolEvents } from '../tileTool'
import { GeoOptions, MapGeoTool, MapGeoToolEvents } from '../geoTool'
import {
  BaseMapTryConfig,
  BaseMapTool,
  TerrainConfig,
  BaseMapToolEvents
} from '../baseMapTool'
import {
  MaskEntityOption,
  MapMaskTool,
  MapMaskToolEvents
} from '../mapMaskTool'
import { FlyConfig, MapFlyTool, MapFlyToolEvents } from '../flyTool'
import { HeatMapOptions, HeatMapTool } from '../heatMapTool'

/**
 * 场景配置
 */
export interface SceneConfig {
  /**
   * 初始相机位置，角度
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
  geos?: GeoOptions[]
  /**
   * 默认底图
   */
  map?: BaseMapTryConfig
  /**
   * 默认地形
   */
  terrain?: TerrainConfig
  /**
   * 遮罩
   */
  mask?: MaskEntityOption
  /**
   * 热力图
   */
  heatMaps?: HeatMapOptions[]
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
type MapSceneToolEvents = MapCameraToolEvents &
  MapTileToolEvents &
  MapGeoToolEvents &
  BaseMapToolEvents &
  MapMaskToolEvents &
  MapFlyToolEvents

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
  camera: MapCameraTool
  tile: MapTileTool
  geo: MapGeoTool
  baseMap: BaseMapTool
  mask: MapMaskTool
  fly: MapFlyTool
  heat: HeatMapTool
  constructor(options: MapSceneToolOptions) {
    super(options)
    this.#config = options.config
    this.camera = new MapCameraTool({})
    this.camera.eventBus.on('camera-change', e => {
      this.eventBus.fire('camera-change', e)
    })
    this.tile = new MapTileTool({})
    this.tile.eventBus.on('pick-tile', e => {
      this.eventBus.fire('pick-fea', e)
    })
    this.tile.eventBus.on('pick-tile-all', e => {
      this.eventBus.fire('pick-fea-all', e)
    })
    this.tile.eventBus.on('hover-tile', e => {
      this.eventBus.fire('hover-tile', e)
    })
    this.tile.eventBus.on('hover-tile-all', e => {
      this.eventBus.fire('hover-tile-all', e)
    })
    this.geo = new MapGeoTool({})
    this.geo.eventBus.on('pick-fea', e => {
      this.eventBus.fire('pick-fea', e)
    })
    this.geo.eventBus.on('pick-fea-all', e => {
      this.eventBus.fire('pick-fea-all', e)
    })
    this.baseMap = new BaseMapTool({})
    this.baseMap.eventBus.on('base-map-change', e => {
      this.eventBus.fire('base-map-change', e)
    })
    this.baseMap.eventBus.on('terrain-change', e => {
      this.eventBus.fire('terrain-change', e)
    })
    this.mask = new MapMaskTool({})
    this.fly = new MapFlyTool({})
    this.fly.eventBus.on('flying-change', e => {
      this.eventBus.fire('flying-change', e)
    })
    this.fly.eventBus.on('time-change', e => {
      this.eventBus.fire('time-change', e)
    })
    this.heat = new HeatMapTool({})
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
  }

  prepareScene(config?: SceneConfig, duration = 0) {
    this.#config = config
    this.tile.clear()
    this.geo.clear()
    this.baseMap.clear()
    this.mask.clear()
    this.fly.clear()
    this.heat.clear()
    if (config) {
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
      if (config.map) {
        this.baseMap.tryImagery(config.map)
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
      if (config.heatMaps?.length) {
        const promises = config.heatMaps.map(t => this.heat.addHeatMap(t))
        Promise.allSettled(promises).catch(err => {
          console.error(err)
        })
      }
    }
  }

  get config() {
    return this.#config
  }
}
