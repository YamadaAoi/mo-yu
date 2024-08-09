/*
 * @Author: zhouyinkui
 * @Date: 2024-01-11 14:21:20
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-08-05 10:54:03
 * @Description:
 */
import {
  ArcGisMapServerImageryProvider,
  CesiumTerrainProvider,
  EllipsoidTerrainProvider,
  ImageryLayer,
  ImageryProvider,
  IonImageryProvider,
  IonResource,
  MapboxImageryProvider,
  TileMapServiceImageryProvider,
  UrlTemplateImageryProvider,
  WebMapServiceImageryProvider,
  WebMapTileServiceImageryProvider
} from 'cesium'
import { ToolBase, ToolBaseOptions } from '@mo-yu/core'
import { mapStoreTool } from '../storeTool'

interface BaseConfig {
  id: string
  name?: string
  icon?: string
  tooltip?: string
}

/**
 * xyz 格式底图配置
 */
export interface XYZConfig extends BaseConfig {
  type: 'XYZ'
  provider: UrlTemplateImageryProvider.ConstructorOptions[]
}

/**
 * WMS底图配置
 */
export interface WMSConfig extends BaseConfig {
  type: 'WMS'
  provider: WebMapServiceImageryProvider.ConstructorOptions[]
}

/**
 * WMTS底图配置
 */
export interface WMTSConfig extends BaseConfig {
  type: 'WMTS'
  provider: WebMapTileServiceImageryProvider.ConstructorOptions[]
}

/**
 * TMS底图配置
 */
export interface TMSConfig extends BaseConfig {
  type: 'TMS'
  provider: TileMapServiceImageryProvider.ConstructorOptions[]
}

/**
 * ION底图配置
 */
export interface IONConfig extends BaseConfig {
  type: 'ION'
  provider: IonImageryProvider.ConstructorOptions[]
}

/**
 * arcgis地图配置
 */
export interface ArcgisConfig extends BaseConfig {
  type: 'Arcgis'
  provider: ArcGisMapServerImageryProvider.ConstructorOptions[]
}

/**
 * Mapbox地图配置
 */
export interface MapboxConfig extends BaseConfig {
  type: 'Mapbox'
  provider: MapboxImageryProvider.ConstructorOptions[]
}

/**
 * 底图配置
 */
export type BaseMapConfig =
  | WMSConfig
  | WMTSConfig
  | TMSConfig
  | IONConfig
  | ArcgisConfig
  | MapboxConfig
  | XYZConfig

/**
 * 地图服务条件配置
 */
export interface BaseMapTryConfig extends BaseConfig {
  map: BaseMapConfig
  /**
   * 判断条件，是一个可访问的get请求地址或是一个promise
   */
  condition?: string | Promise<boolean>
  default?: BaseMapConfig
}

export interface TerrProvider extends CesiumTerrainProvider.ConstructorOptions {
  /**
   * 自定义地形
   */
  url: string
  /**
   * Ion
   */
  assetId?: number
  /**
   * Ion
   */
  accessToken?: string
  /**
   * Ion
   */
  server?: string
}

/**
 * Terrain底图配置
 */
export interface TerrainConfig extends BaseConfig {
  type: 'Terrain'
  provider: TerrProvider
}

function createTerrainProvider(p: TerrProvider) {
  const { assetId, accessToken, server, url, ...rest } = p
  let path: any
  try {
    if (assetId !== undefined) {
      path = IonResource.fromAssetId(assetId, {
        accessToken: accessToken,
        server: server
      })
    } else {
      path = url
    }
  } catch (error) {
    console.error(`解析底图配置失败！${error}`)
  }
  return CesiumTerrainProvider.fromUrl(path, rest)
}

/**
 * 创建Imagery
 * @param config - 底图配置BaseMapConfig
 */
export function createImageryProvider(config: BaseMapConfig) {
  let providers: ImageryProvider[] = []
  if (config.type === 'ION') {
    providers = config.provider.map(p => new IonImageryProvider(p))
  } else if (config.type === 'TMS') {
    providers = config.provider.map(p => new TileMapServiceImageryProvider(p))
  } else if (config.type === 'WMS') {
    providers = config.provider.map(p => new WebMapServiceImageryProvider(p))
  } else if (config.type === 'WMTS') {
    providers = config.provider.map(
      p => new WebMapTileServiceImageryProvider(p)
    )
  } else if (config.type === 'Arcgis') {
    providers = config.provider.map(p => new ArcGisMapServerImageryProvider(p))
  } else if (config.type === 'Mapbox') {
    providers = config.provider.map(p => new MapboxImageryProvider(p))
  } else if (config.type === 'XYZ') {
    providers = config.provider.map(p => new UrlTemplateImageryProvider(p))
  }
  return providers
}

/**
 * 底图事件
 */
export interface BaseMapToolEvents {
  /**
   * 底图切换事件
   */
  'base-map-change': {
    /**
     * 发送生效中的底图id
     */
    id: string
  }
  /**
   * 地形切换事件
   */
  'terrain-change': {
    /**
     * 发送生效中的地形id
     */
    id: string
  }
}

export class BaseMapTool extends ToolBase<ToolBaseOptions, BaseMapToolEvents> {
  baseMap = ''
  terrain = ''
  #curLayers: ImageryLayer[] = []
  #layerMap: Map<string, ImageryLayer[]> = new Map()
  constructor(options: ToolBaseOptions) {
    super(options)
  }

  /**
   * 启用
   */
  enable(): void {
    //
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.clear()
  }

  /**
   * 底图还原
   */
  clear() {
    this.#clearImagery()
    this.baseMap = ''
    this.terrain = ''
    if (this.#viewer) {
      this.#viewer.terrainProvider = new EllipsoidTerrainProvider()
    }
  }

  /**
   * 按条件地图服务加载，先加载默认地图，判断条件condition若为true，替换为map
   * @param config - 配置
   */
  tryImagery(config: BaseMapTryConfig) {
    if (config.condition) {
      if (config.default) {
        this.addImagery(config.default)
      }
      let promise: Promise<boolean>
      if (typeof config.condition === 'string') {
        promise = this.#createPromise(config.condition)
      } else {
        promise = config.condition
      }
      promise
        .then(flag => {
          if (flag) {
            this.addImagery(config.map)
          }
        })
        .catch(err => {
          console.error(err)
        })
    } else {
      this.addImagery(config.map)
    }
  }

  /**
   * 底图添加(默认只有一个底图)
   * 添加时清除前一个底图
   * @param config - 底图配置BaseMapConfig
   */
  addImagery(config: BaseMapConfig) {
    if (this.#viewer) {
      this.#clearImagery()
      if (config.id === this.baseMap) {
        this.baseMap = ''
      } else {
        this.baseMap = config.id
        const providers = createImageryProvider(config)
        // 底图默认依次添加到最下面
        this.#curLayers = providers.map((p, i) =>
          this.#viewer.imageryLayers.addImageryProvider(p, i)
        )
      }
      this.eventBus.fire('base-map-change', {
        id: this.baseMap
      })
    }
  }

  /**
   * 按条件影像切片类图层加载，先加载默认影像切片，判断条件condition若为true，替换为map
   * @param config - 配置
   */
  tryImageryLayer(config: BaseMapTryConfig) {
    if (config.condition) {
      if (config.default) {
        this.addImageryLayer(config.default)
      }
      let promise: Promise<boolean>
      if (typeof config.condition === 'string') {
        promise = this.#createPromise(config.condition)
      } else {
        promise = config.condition
      }
      promise
        .then(flag => {
          if (flag) {
            this.addImageryLayer(config.map)
          }
        })
        .catch(err => {
          console.error(err)
        })
    } else {
      this.addImageryLayer(config.map)
    }
  }

  /**
   * 影像切片类图层添加
   * @param config - 影像切片配置BaseMapConfig
   */
  addImageryLayer(config: BaseMapConfig) {
    if (this.#viewer) {
      const providers = createImageryProvider(config)
      const layers = providers.map(p =>
        this.#viewer.imageryLayers.addImageryProvider(p)
      )
      if (config.id) {
        this.#layerMap.set(config.id, layers)
      }
    }
  }

  /**
   * 根据id获取影像切片图层列表
   * @param id - 影像切片id
   * @returns
   */
  getImageryLayerById(id: string) {
    return this.#layerMap.get(id)
  }

  /**
   * 影像切片显隐
   * @param id - 影像切片 Id
   * @param show - 显隐
   */
  toggleImageryLayer(id: string, show: boolean) {
    const layers = this.getImageryLayerById(id)
    if (layers?.length) {
      layers.forEach(l => {
        l.show = show
      })
    }
  }

  /**
   * 移除影像切片
   * @param id - 影像切片 Id
   */
  removeImageryLayer(id: string) {
    const layers = this.getImageryLayerById(id)
    if (layers?.length) {
      layers.forEach(l => {
        this.#viewer.imageryLayers.remove(l)
      })
    }
  }

  /**
   * 定位至影像
   * @param id - 影像id
   */
  locateImageryLayer(id: string) {
    const layers = this.getImageryLayerById(id)
    if (layers?.length) {
      this.#viewer
        ?.flyTo(layers[0], {
          duration: 1
        })
        .catch(err => {
          console.error(err)
        })
    }
  }

  /**
   * 获取地形对象
   * @param config
   * @param update
   * @returns
   */
  getTerrainProvider(config: TerrainConfig, update = false) {
    if (update && config.id !== this.terrain) {
      this.terrain = config.id
      this.eventBus.fire('terrain-change', {
        id: this.terrain
      })
    }
    return createTerrainProvider(config.provider)
  }

  /**
   * 添加地形
   * @param config - 地形配置
   */
  addTerrain(config: TerrainConfig) {
    if (this.#viewer && config.id !== this.terrain) {
      this.terrain = config.id
      createTerrainProvider(config.provider)
        .then(terr => {
          this.#viewer.terrainProvider = terr
        })
        .catch(err => {
          console.error(err)
        })
      this.eventBus.fire('terrain-change', {
        id: this.terrain
      })
    }
  }

  #clearImagery() {
    if (this.#viewer && this.#curLayers.length) {
      this.#curLayers.forEach(l => {
        this.#viewer.imageryLayers.remove(l)
      })
      this.#curLayers = []
    }
  }

  async #createPromise(url: string) {
    const res = await fetch(url)
    return res.ok
  }

  get #viewer() {
    return mapStoreTool.getMap()?.viewer
  }
}
