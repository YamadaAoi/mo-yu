/*
 * @Author: zhouyinkui
 * @Date: 2023-12-15 17:33:00
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-02-04 10:58:03
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
  Cartesian2
} from 'cesium'
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
     * 覆盖广告牌样式
     */
    billboard?: StyleBillboard
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

interface MapGeoToolEvents {}

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
  #geoNames: string[] = []
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
          this.#viewer?.dataSources.add(s)
          this.#geoNames.push(s.name)
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
                if (option.custom?.billboard) {
                  this.#handleBillboard(e, option.custom.billboard)
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

  #handleBillboard(e: Entity, option: StyleBillboard) {
    if (e.billboard) {
      e.billboard = createEntityBillboardGraphics(option.style)
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
