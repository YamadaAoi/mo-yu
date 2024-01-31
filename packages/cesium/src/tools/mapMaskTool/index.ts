/*
 * @Author: zhouyinkui
 * @Date: 2024-01-31 13:49:17
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-31 16:53:45
 * @Description: 地图简单遮罩
 */
import { Cartesian3, Entity, PolygonHierarchy } from 'cesium'
import { ToolBase, ToolBaseOptions } from '@mo-yu/core'
import {
  PolygonEntityOption,
  createEntityPolygon
} from '../../core/geo/entity/polygon'
import { mapStoreTool } from '../storeTool'

/**
 * 遮罩多边形参数
 */
export type MaskEntityOption = Omit<PolygonEntityOption, 'hierarchy'> & {
  /**
   * 外边框，不支持跨经纬度0度的面，如-180~180，-90~90
   * 若是一个geojson链接，最好是只包含一个polygon的FeatureCollection，多个或MultiPolygon会进行扁平化处理
   */
  hierarchy?: string | number[]
  holes?: string | number[][]
}

/**
 * 场景事件
 */
interface MapMaskToolEvents {}

/**
 * 遮罩工具
 * @example
 * ```ts
 * const tool = new MapMaskTool({})
 *
 * tool.enable()
 * tool.addMask(config)
 * ```
 */
export class MapMaskTool extends ToolBase<ToolBaseOptions, MapMaskToolEvents> {
  #mask: Entity | undefined
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
    this.clearMask()
  }

  /**
   * 清除遮罩
   */
  clearMask() {
    if (this.#mask) {
      this.#viewer?.entities.remove(this.#mask)
    }
  }

  /**
   * 显隐
   * @param show - boolean
   */
  toggleMask(show: boolean) {
    if (this.#mask) {
      this.#mask.show = show
    }
  }

  /**
   * 添加遮罩
   * @param option - 参数
   */
  async addMask(option: MaskEntityOption) {
    if (option.hierarchy) {
      let points: Cartesian3[] = []
      let hs: Cartesian3[][] = []
      if (Array.isArray(option.hierarchy)) {
        points = Cartesian3.fromDegreesArray(option.hierarchy)
      } else {
        const res = await fetch(option.hierarchy)
        const json: any = await res?.json()
        let coordinates: number[] = []
        if (json?.features?.length) {
          json.features.forEach((fea: any) => {
            if (
              fea?.geometry?.coordinates?.length &&
              (fea?.geometry?.type === 'Polygon' ||
                fea?.geometry?.type === 'MultiPolygon')
            ) {
              coordinates = coordinates.concat(
                fea.geometry.coordinates.flat(Infinity)
              )
            }
          })
        }
        points = Cartesian3.fromDegreesArray(coordinates)
      }
      if (option.holes) {
        if (Array.isArray(option.holes)) {
          hs = option.holes.map(hole => Cartesian3.fromDegreesArray(hole))
        } else {
          const res = await fetch(option.holes)
          const json: any = await res?.json()
          if (json?.features?.length) {
            json.features.forEach((fea: any) => {
              if (fea?.geometry?.coordinates?.length) {
                if (fea?.geometry?.type === 'Polygon') {
                  const temp = fea.geometry.coordinates.flat(Infinity)
                  if (temp?.length) {
                    hs.push(Cartesian3.fromDegreesArray(temp))
                  }
                } else if (fea?.geometry?.type === 'MultiPolygon') {
                  fea.geometry.coordinates.forEach((coord: any) => {
                    const temp = coord?.flat(Infinity)
                    if (temp?.length) {
                      hs.push(Cartesian3.fromDegreesArray(temp))
                    }
                  })
                }
              }
            })
          }
        }
      }
      if (points.length) {
        const ph = new PolygonHierarchy(
          points,
          hs.map(hole => new PolygonHierarchy(hole))
        )
        const { hierarchy, holes, ...rest } = option
        this.#mask = createEntityPolygon({
          ...rest,
          hierarchy: ph
        })
        this.#viewer?.entities.add(this.#mask)
      }
    }
  }

  get #viewer() {
    return mapStoreTool.getMap()?.viewer
  }
}
