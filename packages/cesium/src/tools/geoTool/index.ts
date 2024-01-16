/*
 * @Author: zhouyinkui
 * @Date: 2023-12-15 17:33:00
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-16 15:00:23
 * @Description: geojson工具
 */
import { GeoJsonDataSource, Resource, Color, JulianDate, Entity } from 'cesium'
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
  }
}

interface StyleBoder {
  style: PolylineEntityOption
}

interface StyleWall {
  style: WallEntityOption
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
          this.#geoNames.push(s.name)
          this.#viewer?.dataSources.add(s)
          if (locate) {
            this.#viewer.zoomTo(s)
          }
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
              })
            }
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

  get #viewer() {
    return mapStoreTool.getMap()?.viewer
  }
}
