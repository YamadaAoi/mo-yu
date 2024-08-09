/*
 * @Author: zhouyinkui
 * @Date: 2024-01-31 13:49:17
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-08-07 10:55:22
 * @Description: 地图简单遮罩
 */
import {
  Cartesian3,
  GroundPrimitive,
  PolygonHierarchy,
  Primitive
} from 'cesium'
import { ToolBase, ToolBaseOptions } from '@mo-yu/core'
import { mapStoreTool } from '../storeTool'
import { PolygonOption, createPolygon } from '../../core/geo/primitive/polygon'

/**
 * 遮罩多边形参数
 */
export type MaskPrimitiveOption = Omit<PolygonOption, 'positions'> & {
  /**
   * 外边框，不支持跨经纬度0度的面，如-180~180，-90~90
   * 逆时针
   * 若是一个geojson链接，最好是只包含一个polygon的FeatureCollection，多个或MultiPolygon会进行扁平化处理
   */
  hierarchy?: string | number[]
  /**
   * 内边框
   * 顺时针
   */
  holes?: string | number[][]
}

/**
 * 场景事件
 */
export interface MapMaskToolEvents {}

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
  #mask: Primitive | GroundPrimitive | undefined
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
   * 清除遮罩
   */
  clear() {
    if (this.#mask) {
      this.#viewer?.scene.primitives.remove(this.#mask)
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
  async addMask(option: MaskPrimitiveOption) {
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
        this.#mask = createPolygon({
          ...rest,
          positions: ph
        })
        this.#viewer?.scene.primitives.add(this.#mask)
      }
    }
  }

  get #viewer() {
    return mapStoreTool.getMap()?.viewer
  }
}
