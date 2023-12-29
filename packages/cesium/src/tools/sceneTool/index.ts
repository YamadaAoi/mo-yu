/*
 * @Author: zhouyinkui
 * @Date: 2023-12-29 14:38:10
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-12-29 16:35:31
 * @Description: 地图场景初始化工具
 */
import { ToolBase, ToolBaseOptions } from '@mo-yu/core'
import { CameraParam, MapCameraTool } from '../cameraTool'
import { TileOption, MapTileTool } from '../tileTool'
import { GeoOptions, MapGeoTool } from '../geoTool'

/**
 * 场景配置
 */
export interface SceneConfig {
  /**
   * 初始相机位置，角度
   */
  camera: CameraParam
  /**
   * 场景中默认3dTiles
   */
  tiles: TileOption[]
  /**
   * 场景中默认矢量
   */
  geos: GeoOptions[]
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
interface MapSceneToolEvents {}

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
  camera = new MapCameraTool({})
  tile = new MapTileTool({})
  geo = new MapGeoTool({})
  constructor(options: MapSceneToolOptions) {
    super(options)
    this.prepareScene(options.config)
  }

  /**
   * 启用
   */
  enable(): void {
    this.camera.enable()
    this.tile.enable()
    this.geo.enable()
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.camera.destroy()
    this.tile.destroy()
    this.geo.destroy()
  }

  prepareScene(config?: SceneConfig, duration = 0) {
    this.#config = config
    this.tile.clear()
    this.geo.clear()
    if (config) {
      if (config.camera) {
        this.camera.flyTo(config.camera, duration)
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
    }
  }

  get config() {
    return this.#config
  }
}
