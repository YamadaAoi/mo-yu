/*
 * @Author: zhouyinkui
 * @Date: 2023-12-15 17:33:00
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-19 19:31:32
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
import { ToolBase, ToolBaseOptions } from '@mo-yu/core'
import { mapStoreTool } from '../storeTool'
import { getColor } from '../../core/material'
import {
  PolylineEntityOption,
  createEntityPolylineGraphics
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
export type GeoOptions = Omit<
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
  /**
   * 广告牌聚合参数
   */
  cluster?: {
    options?: ConstructorParameters<typeof EntityCluster>[0]
    billboard?: BillboardParam
    label?: LabelParam
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
}

export interface StyleWall {
  style: WallEntityOption
}

export interface StyleBillboard {
  style: BillboardEntityOption
}

export interface StyleLabel {
  style: LabelEntityOption
}

export interface StylePolygon {
  style: PolygonEntityOption
}

interface MapGeoToolEvents {
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
   * 清除所有矢量
   */
  clear() {
    this.#viewer?.dataSources.removeAll()
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
    const geo = this.getGeoById(id)
    if (geo) {
      this.#viewer?.dataSources.remove(geo)
    }
  }

  /**
   * 添加GeoJson
   * @param option - geojson参数
   */
  addGeo(option: GeoOptions) {
    if (option) {
      const { id, locate, url, markerColor, stroke, fill, custom, ...rest } =
        option
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
          this.#handlePick(id ?? s.name)
          if (option.custom) {
            const entities = s.entities.values
            if (entities?.length) {
              entities.forEach(e => {
                if (option.custom?.border) {
                  this.#handleBorder(e, option.custom.border)
                }
                if (option.custom?.wall) {
                  this.#handleWall(e, option.custom.wall)
                }
                if (option.custom?.label) {
                  this.#handleLabel(e, option.custom.label)
                }
                if (option.custom?.billboard) {
                  this.#handleBillboard(e, option.custom.billboard)
                }
                if (option.custom?.polygon) {
                  this.#handlePolygon(e, option.custom.polygon)
                }
              })
            }
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

  #handlePick(MoYuGeoId: string) {
    const handler = new ScreenSpaceEventHandler(this.#viewer.canvas)
    handler.setInputAction((event: ScreenSpaceEventHandler.PositionedEvent) => {
      if (event?.position) {
        const picked = this.#viewer.scene.drillPick(event.position)
        if (picked?.length) {
          const properties = picked
            .filter(p => p?.id instanceof Entity)
            .map(p => {
              const property: any = { MoYuGeoId }
              p.id.properties?.propertyNames?.forEach((str: string) => {
                property[str] = p.id.properties[str]?._value
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
    }, ScreenSpaceEventType.LEFT_CLICK)
  }

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
    if (e.billboard) {
      e.billboard = createEntityBillboardGraphics(option.style)
    }
  }

  #handlePolygon(e: Entity, option: StylePolygon) {
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
      e.polygon = createEntityPolygonGraphics({
        hierarchy: e.polygon.hierarchy,
        ...rest
      })
    }
  }

  #handleCluster(option: GeoOptions, s: GeoJsonDataSource) {
    if (option.cluster?.options) {
      const options: any = option.cluster.options
      const cluster: any = s.clustering
      Object.keys(options).forEach((key: string) => {
        cluster[key] = options[key]
      })
      s.clustering.clusterEvent.addEventListener((entities, cluster) => {
        if (option.cluster?.label) {
          const style: any = option.cluster.label
          const label: any = cluster.label
          Object.keys(style).forEach(key => {
            if (
              key === 'pixelOffset' &&
              Array.isArray(style[key]) &&
              style[key].length === 2
            ) {
              label[key] = new Cartesian2(style[key][0], style[key][1])
            } else {
              label[key] = style[key]
            }
          })
          cluster.label.text = entities.length.toLocaleString()
        }
        if (option.cluster?.billboard) {
          const style: any = option.cluster.billboard
          const billboard: any = cluster.billboard
          Object.keys(style).forEach(key => {
            if (
              key === 'pixelOffset' &&
              Array.isArray(style[key]) &&
              style[key].length === 2
            ) {
              billboard[key] = new Cartesian2(style[key][0], style[key][1])
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
