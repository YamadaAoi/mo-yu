/*
 * @Author: zhouyinkui
 * @Date: 2023-12-15 17:33:00
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-04-07 11:27:51
 * @Description: geojson工具
 */
import {
  GeoJsonDataSource,
  Resource,
  Color,
  JulianDate,
  Entity,
  EntityCluster,
  Billboard,
  Label,
  Cartesian2,
  Cartesian3,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType
} from 'cesium'
import { polygon } from '@turf/helpers'
import centroid from '@turf/centroid'
import { ToolBase, ToolBaseOptions, debounce } from '@mo-yu/core'
import { mapStoreTool } from '../storeTool'
import { getColor } from '../../core/material'
import {
  PolylineEntityOption,
  createEntityPolylineGraphics,
  createEntityPolylineGraphicsOptions
} from '../../core/geo/entity/polyline'
import {
  WallEntityOption,
  createEntityWallGraphics
} from '../../core/geo/entity/wall'
import {
  BillboardEntityOption,
  createEntityBillboardGraphics
} from '../../core/geo/entity/billboard'
import {
  LabelEntityOption,
  createEntityLabelGraphics
} from '../../core/geo/entity/label'
import {
  PolygonEntityOption,
  createEntityPolygonGraphics
} from '../../core/geo/entity/polygon'
import { cartesian3ToLngLat } from '../../utils/coordTranform'
import { getPosiOnMap } from '../../utils/getPosi'
import { getpixelOffset } from '../../utils/objectCreate'
import { LegendColor } from '../../support/legend'
import { resourceTool } from '../resourceTool'

/**
 * geojson参数，在原始参数基础上合并了参数:
 * url: 数据路径
 * 更改了(使用css颜色)颜色类参数:
 * markerColor
 * stroke
 * fill
 * 添加了参数
 * id: 唯一标识
 * locate: 是否定位
 * custom: 自定义样式
 * border: 多边形边界线样式
 */
export type GeoOption = Omit<
  GeoJsonDataSource.LoadOptions,
  'markerColor' | 'stroke' | 'fill'
> & {
  url: Resource | string | object
  markerColor?: Color | string
  stroke?: Color | string
  fill?: Color | string
  id?: string
  locate?: boolean
  custom?: {
    /**
     * 相机高度在[near, far]之间展示
     */
    show?: [number, number] | boolean
    /**
     * 多边形边界线样式
     */
    border?: StyleBoder
    /**
     * 多边形边界墙样式
     */
    wall?: StyleWall
    /**
     * 多边形添加label样式
     */
    label?: StyleLabel
    /**
     * 覆盖广告牌样式
     */
    billboard?: StyleBillboard
    /**
     * 覆盖多边形样式，只会覆盖PolygonGraphics.ConstructorOptions除了hierarchy的所有参数
     */
    polygon?: StylePolygon
  }
}

export type BillboardParam = Omit<Partial<Billboard>, 'pixelOffset'> & {
  pixelOffset?: Cartesian2 | [number, number]
}

export type LabelParam = Omit<Partial<Label>, 'pixelOffset'> & {
  pixelOffset?: Cartesian2 | [number, number]
}

export interface StyleBoder {
  style: PolylineEntityOption
  pick?: PolylineEntityOption
}

export interface StyleWall {
  style: WallEntityOption
}

export interface StyleBillboard {
  style: BillboardEntityOption
  /**
   * 广告牌聚合参数
   */
  cluster?: {
    options?: ConstructorParameters<typeof EntityCluster>[0]
    billboard?: BillboardParam
    label?: LabelParam
  }
}

export interface StyleLabel {
  style: LabelEntityOption
}

export interface StylePolygon {
  style: PolygonEntityOption
  legend?: {
    paramName?: string
    colorList?: string | LegendColor[]
  }
}

export interface MapGeoToolEvents {
  /**
   * 选取最上层fea属性
   */
  'pick-fea': {
    properties: any
  }
  /**
   * 选取所有fea属性
   */
  'pick-fea-all': {
    properties: any[]
  }
  /**
   * 双击选取所有fea属性
   */
  'double-click-fea-all': {
    properties: any[]
  }
}

/**
 * 添加geojson
 * @example
 * ```ts
 * const tool = new MapGeoTool({})
 *
 * tool.enable()
 * tool.addGeo(config, false, config.id)
 * ```
 */
export class MapGeoTool extends ToolBase<ToolBaseOptions, MapGeoToolEvents> {
  #geoOptions: GeoOption[] = []
  #handler: ScreenSpaceEventHandler | undefined
  constructor(options: ToolBaseOptions) {
    super(options)
  }

  /**
   * 启用
   */
  enable(): void {
    if (this.#viewer?.canvas) {
      this.#viewer.camera.changed.addEventListener(this.#handleShow)
      this.#handler = new ScreenSpaceEventHandler(this.#viewer.canvas)
      this.#handler.setInputAction(
        this.#handlePick,
        ScreenSpaceEventType.LEFT_CLICK
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
    this.clear()
    this.#viewer?.camera.changed.removeEventListener(this.#handleShow)
    this.#handler?.destroy()
  }

  /**
   * 清除所有矢量
   */
  clear() {
    this.#viewer?.dataSources.removeAll()
    this.#geoOptions = []
  }

  /**
   * 根据id获取GeoJsonDataSource，请自行维护唯一name
   * @param id - GeoJson Id
   * @returns
   */
  getGeoById(id: string) {
    const geos = this.#viewer?.dataSources.getByName(id)
    return geos[0]
  }

  /**
   * 定位至GeoJson
   * @param id - GeoJson Id
   */
  locateGeo(id: string) {
    const geo = this.getGeoById(id)
    if (geo) {
      this.#viewer
        ?.flyTo(geo, {
          duration: 1
        })
        .catch(err => {
          console.error(err)
        })
    }
  }

  /**
   * GeoJson显隐
   * @param id - GeoJson Id
   * @param show - 显隐
   */
  toggleGeo(id: string, show: boolean) {
    const geo = this.getGeoById(id)
    if (geo) {
      geo.show = show
    }
  }

  /**
   * 移除GeoJson
   * @param id - GeoJson Id
   */
  removeGeo(id: string) {
    if (id) {
      this.#geoOptions = this.#geoOptions.filter(g => g.id !== id)
      const geo = this.getGeoById(id)
      if (geo) {
        this.#viewer?.dataSources.remove(geo)
      }
    }
  }

  /**
   * 添加GeoJson
   * @param option - geojson参数
   */
  addGeo(option: GeoOption) {
    if (option) {
      const { id, locate, url, markerColor, stroke, fill, custom, ...rest } =
        option
      if (id && !this.#geoOptions.some(g => g.id === id)) {
        this.#geoOptions.push(option)
      }
      const source = new GeoJsonDataSource(id)
      const o: GeoJsonDataSource.LoadOptions = { ...rest }
      if (markerColor) {
        o.markerColor = getColor(markerColor)
      }
      if (stroke) {
        o.stroke = getColor(stroke)
      }
      if (fill) {
        o.fill = getColor(fill)
      }
      source
        .load(url, o)
        .then(s => {
          s.name = id ?? s.name
          this.#viewer?.dataSources.add(s)
          const entities = s.entities.values
          if (entities?.length) {
            entities.forEach(e => {
              e.properties?.addProperty('MoYuGeoId', s.name)
              e.properties?.addProperty('MoYuEntityId', e.id)
              if (option.custom) {
                if (option.custom.border) {
                  this.#handleBorder(e, option.custom.border)
                }
                if (option.custom.wall) {
                  this.#handleWall(e, option.custom.wall)
                }
                if (option.custom.label) {
                  this.#handleLabel(e, option.custom.label)
                }
                if (option.custom.billboard) {
                  this.#handleBillboard(e, option.custom.billboard)
                }
                if (option.custom.polygon) {
                  this.#handlePolygon(e, option.custom.polygon).catch(err => {
                    console.error(err)
                  })
                }
              }
            })
          }

          this.#handleCluster(option, s)
          if (locate) {
            this.#viewer.flyTo(s, { duration: 1 })
          } else {
            this.#viewer?.scene.requestRender()
          }
        })
        .catch(err => {
          console.error(`load geojson [${url}] failed![${err}]`)
        })
    }
  }

  /**
   * 清空指定图层选中效果
   * @param id - 图层id
   */
  clearClick(id: string) {
    const geo = this.getGeoById(id)
    const option = this.#geoOptions.find(g => g.id === id)
    if (geo && option?.custom?.border?.pick) {
      const entities = geo.entities.values
      if (entities?.length) {
        entities.forEach(e => {
          if (e.polyline && option?.custom?.border?.pick) {
            const optNew: any = createEntityPolylineGraphicsOptions(
              option.custom.border.pick
            )
            const opt: any = createEntityPolylineGraphicsOptions(
              option.custom.border.style
            )
            const polyline: any = e.polyline
            Object.keys(optNew).forEach(key => {
              polyline[key] = opt[key]
            })
          }
        })
      }
    }
  }

  #handleShow = () => {
    if (this.#viewer && this.#geoOptions?.length) {
      const height = this.#viewer.camera.positionCartographic.height
      this.#geoOptions.forEach(g => {
        if (
          g?.id &&
          Array.isArray(g.custom?.show) &&
          g.custom?.show?.length === 2
        ) {
          const geo = this.getGeoById(g.id)
          if (geo) {
            geo.show =
              height >= g.custom.show[0] && height <= g.custom.show[1]
                ? true
                : false
            // console.log(height, geo.show)
          }
        }
      })
    }
  }

  #handlePick = debounce((event: ScreenSpaceEventHandler.PositionedEvent) => {
    if (event?.position) {
      const picked = this.#viewer.scene.drillPick(event.position)
      if (picked?.length) {
        const properties = picked
          .filter(p => p?.id instanceof Entity)
          .map(p => {
            const entity: Entity = p.id
            const MoYuGeoId = entity.properties?.MoYuGeoId?._value
            const MoYuEntityId = entity.id
            if (MoYuGeoId && MoYuEntityId) {
              const option = this.#geoOptions.find(g => g.id === MoYuGeoId)
              if (option?.custom?.border?.pick) {
                this.#refreshBorder(
                  MoYuGeoId,
                  MoYuEntityId,
                  option.custom.border
                )
              }
            }
            const property: any = {}
            entity.properties?.propertyNames?.forEach((str: string) => {
              property[str] = entity.properties?.[str]?._value
            })
            return property
          })
        if (properties.length) {
          this.eventBus.fire('pick-fea', {
            properties: properties[0]
          })
          this.eventBus.fire('pick-fea-all', {
            properties
          })
        }
      }
    }
  })

  #handleDBClick = debounce(
    (event: ScreenSpaceEventHandler.PositionedEvent) => {
      if (event?.position) {
        const picked = this.#viewer.scene.drillPick(event.position)
        if (picked?.length) {
          const properties = picked
            .filter(p => p?.id instanceof Entity)
            .map(p => {
              const entity: Entity = p.id
              const property: any = {}
              entity.properties?.propertyNames?.forEach((str: string) => {
                property[str] = entity.properties?.[str]?._value
              })
              return property
            })
          if (properties.length) {
            this.eventBus.fire('double-click-fea-all', {
              properties
            })
          }
        }
      }
    }
  )

  #handleBorder(e: Entity, option: StyleBoder) {
    if (e.polygon) {
      const positions = e.polygon.hierarchy?.getValue(
        JulianDate.now()
      )?.positions
      if (positions?.length) {
        e.polyline = createEntityPolylineGraphics({
          ...option.style,
          positions
        })
      }
    }
  }

  #refreshBorder(geoId: string, entityId: string, style: StyleBoder) {
    const geo = this.getGeoById(geoId)
    if (geo) {
      const entities = geo.entities.values
      if (entities?.length && style.pick) {
        const optNew: any = createEntityPolylineGraphicsOptions(style.pick)
        const opt: any = createEntityPolylineGraphicsOptions(style.style)
        entities.forEach(e => {
          if (e.polyline) {
            const polyline: any = e.polyline
            if (e.id === entityId) {
              Object.keys(optNew).forEach(key => {
                polyline[key] = optNew[key]
              })
            } else {
              Object.keys(optNew).forEach(key => {
                polyline[key] = opt[key]
              })
            }
          }
        })
      }
    }
  }

  #handleWall(e: Entity, option: StyleWall) {
    if (e.polygon) {
      const positions = e.polygon.hierarchy?.getValue(
        JulianDate.now()
      )?.positions
      if (positions?.length) {
        e.wall = createEntityWallGraphics({
          ...option.style,
          positions
        })
      }
    }
  }

  #handleLabel(e: Entity, option: StyleLabel) {
    if (e.polygon) {
      const positions: Cartesian3[] = e.polygon.hierarchy?.getValue(
        JulianDate.now()
      )?.positions
      if (positions?.length) {
        const points = positions.map(p => {
          const ll = cartesian3ToLngLat(p)
          return [ll[0], ll[1]]
        })
        const center = centroid(polygon([points]))
        getPosiOnMap(
          Cartesian3.fromDegrees(
            center.geometry.coordinates[0],
            center.geometry.coordinates[1],
            0
          )
        )
          .then(p => {
            const polyCenter: any = p
            e.position = polyCenter
            e.label = createEntityLabelGraphics({
              ...option.style,
              properties: e.properties
            })
          })
          .catch(err => {
            console.error(err)
          })
      }
    }
  }

  #handleBillboard(e: Entity, option: StyleBillboard) {
    const position = e.position?.getValue(JulianDate.now())
    if (e.billboard && position) {
      getPosiOnMap(position)
        .then(p => {
          const polyCenter: any = p
          e.position = polyCenter
          e.billboard = createEntityBillboardGraphics(option.style)
        })
        .catch(err => {
          console.error(err)
        })
    }
  }

  async #handlePolygon(e: Entity, option: StylePolygon) {
    if (e.polygon && option.style) {
      const {
        id,
        name,
        availability,
        show,
        description,
        position,
        orientation,
        viewFrom,
        parent,
        properties,
        hierarchy,
        ...rest
      } = option.style
      if (option.legend?.paramName && option.legend.colorList) {
        const value = e.properties?.getValue(JulianDate.now())?.[
          option.legend.paramName
        ]
        if (undefined !== value && null !== value) {
          const colors: LegendColor[] = await resourceTool.getResource(
            option.legend.colorList
          )
          if (colors?.length) {
            const c = colors.find(color => color.value === value)
            if (c?.color) {
              rest.material = c.color
            }
          }
        }
      }
      e.polygon = createEntityPolygonGraphics({
        hierarchy: e.polygon.hierarchy,
        ...rest
      })
    }
  }

  #handleCluster(option: GeoOption, s: GeoJsonDataSource) {
    const config: any = option.custom?.billboard?.cluster
    if (config?.options) {
      const cluster: any = s.clustering
      Object.keys(config.options).forEach((key: string) => {
        cluster[key] = config.options[key]
      })
      s.clustering.clusterEvent.addEventListener((entities, cluster) => {
        if (config.label) {
          const style: any = config.label
          const label: any = cluster.label
          Object.keys(style).forEach(key => {
            if (key === 'pixelOffset') {
              label[key] = getpixelOffset(style[key])
            } else {
              label[key] = style[key]
            }
          })
          cluster.label.text = entities.length.toLocaleString()
        }
        if (config.billboard) {
          const style: any = config.billboard
          const billboard: any = cluster.billboard
          Object.keys(style).forEach(key => {
            if (key === 'pixelOffset') {
              billboard[key] = getpixelOffset(style[key])
            } else {
              billboard[key] = style[key]
            }
          })
        }
      })
    }
  }

  get #viewer() {
    return mapStoreTool.getMap()?.viewer
  }
}
