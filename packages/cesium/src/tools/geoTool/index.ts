/*
 * @Author: zhouyinkui
 * @Date: 2023-12-15 17:33:00
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-12-18 18:07:21
 * @Description: geojson工具
 */
import { GeoJsonDataSource, Resource, Color } from 'cesium'
import { ToolBase, ToolBaseOptions } from '@mo-yu/core'
import { mapStoreTool } from '../storeTool'

/**
 * geojson参数，在原始参数基础上新增了url，更改了颜色类参数为css颜色样式
 */
type GeoLoadOptions = Omit<
  GeoJsonDataSource.LoadOptions,
  'markerColor' | 'stroke' | 'fill'
> & {
  url: Resource | string | object
  markerColor?: string
  stroke?: string
  fill?: string
}

interface MapGeoToolEvents {}

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
    this.#removeAllGeos()
  }

  /**
   * 根据id获取GeoJsonDataSource，请自行维护唯一name
   * @param id - GeoJson Id
   * @returns
   */
  getGeoById(id: string) {
    const geos = this.#mapView?.dataSources.getByName(id)
    return geos[0]
  }

  /**
   * 定位至GeoJson
   * @param id - GeoJson Id
   */
  locateGeo(id: string) {
    const geo = this.getGeoById(id)
    if (geo) {
      this.#mapView
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
   * 添加GeoJson
   * @param option - geojson参数
   * @param locate - 是否定位
   * @param id - GeoJson Id
   */
  addGeo(option: GeoLoadOptions, locate?: boolean, id?: string) {
    if (option) {
      const source = new GeoJsonDataSource(id)
      const { url, markerColor, stroke, fill, ...rest } = option
      const o: GeoJsonDataSource.LoadOptions = { ...rest }
      if (markerColor) {
        o.markerColor = Color.fromCssColorString(markerColor)
      }
      if (stroke) {
        o.stroke = Color.fromCssColorString(stroke)
      }
      if (fill) {
        o.fill = Color.fromCssColorString(fill)
      }
      source.load(url, o)
      this.#geoNames.push(source.name)
      this.#mapView?.dataSources.add(source)
      if (locate) {
        this.#mapView.zoomTo(source)
      }
    }
  }

  #removeAllGeos() {
    this.#mapView?.dataSources.removeAll()
  }

  get #mapView() {
    return mapStoreTool.getMap()?.viewer
  }
}
