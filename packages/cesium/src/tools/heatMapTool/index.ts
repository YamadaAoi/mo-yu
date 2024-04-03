/*
 * @Author: zhouyinkui
 * @Date: 2024-03-25 16:44:11
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-27 15:08:46
 * @Description: 热力图
 */
import {
  BoundingSphere,
  Cartesian3,
  ComponentDatatype,
  Geometry,
  GeometryAttribute,
  GeometryAttributes,
  GeometryInstance,
  GeometryPipeline,
  Material,
  MaterialAppearance,
  Primitive,
  PrimitiveCollection,
  PrimitiveType
} from 'cesium'
import h337, { Heatmap, HeatmapConfiguration } from 'heatmap.js'
import { ToolBase, ToolBaseOptions, guid, isNumber } from '@mo-yu/core'
import { mapStoreTool } from '../storeTool'

/**
 * 热力图配置参数
 */
export interface HeatMapOptions {
  /**
   * 点信息，支持4326坐标系FeatureCollection对象或请求链接
   */
  url: string | object
  /**
   * 经纬度边界
   * [xMin,yMin,xMax,yMax]
   */
  bounds: [number, number, number, number]
  /**
   * 唯一标识
   */
  id?: string
  /**
   * 加载后定位
   */
  locate?: boolean
  /**
   * geojson-properties内代表权重的属性字段名称，属性值必须是数字，默认名称"value"
   */
  dataField?: string
  /**
   * 若feature.properties[dataField]不是数字，赋予默认值，默认0
   */
  defaultValue?: number
  /**
   * 所有feature.properties[dataField]的最大值，不提供则自动获取
   */
  max?: number
  /**
   * 所有feature.properties[dataField]的最小值，不提供则自动获取
   */
  min?: number
  /**
   * 经纬度插值间隔,值越小网格越密 默认：0.001
   */
  delta?: number
  /**
   * 几何体起始高度， 单位：米，默认：0
   */
  minheight?: number
  /**
   * 几何体单位权重高度， 单位：米，默认：50
   */
  height?: number
  /**
   * heatmap.js的HeatmapConfiguration
   */
  heatmapjs?: HeatmapConfiguration
}

interface HeatMapToolEvents {}

/**
 * 热力图展示
 * @example
 * ```ts
 * const tool = new HeatMapTool({})
 *
 * tool.enable()
 * tool.addHeatMap({...})
 * ```
 */
export class HeatMapTool extends ToolBase<ToolBaseOptions, HeatMapToolEvents> {
  #width = 1920
  #height = 1080
  #wrap = document.createElement('div')
  #heats = new PrimitiveCollection()
  constructor(options: ToolBaseOptions) {
    super(options)
    this.#wrap = document.createElement('div')
    this.#wrap.style.position = 'relative'
    this.#wrap.style.width = `${this.#width}px`
    this.#wrap.style.height = `${this.#height}px`
    this.#wrap.style.display = 'none'
    document.body.appendChild(this.#wrap)
  }

  /**
   * 启用
   */
  enable(): void {
    this.#viewer?.scene.primitives.add(this.#heats)
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.#viewer?.scene.primitives.remove(this.#heats)
    document.body.removeChild(this.#wrap)
  }

  /**
   * 清除所有heatMap
   */
  clear() {
    this.#heats.removeAll()
  }

  /**
   * 根据id获取heatMap
   * @param id - heatMap Id
   * @returns
   */
  getHeatById(id: string) {
    const len = this.#heats.length
    let p: Primitive | undefined
    for (let i = 0; i < len; i++) {
      const heat = this.#heats.get(i)
      if (heat.MoYuHeatId === id) {
        p = heat
      }
    }
    return p
  }

  /**
   * 定位heatMap
   * @param id - heatMap Id
   */
  locateHeat(id: string) {
    const p: any = this.getHeatById(id)
    const boundingSphere: BoundingSphere = p?.boundingVolume
    if (boundingSphere) {
      this.#viewer?.camera.flyToBoundingSphere(boundingSphere)
    }
  }

  /**
   * 显隐heatMap
   * @param id - heatMap Id
   * @param show - 显隐
   */
  toggleHeat(id: string, show: boolean) {
    const p = this.getHeatById(id)
    if (p) {
      p.show = show
    }
  }

  /**
   * 移除heatMap
   * @param id - heatMap Id
   */
  removeHeat(id: string) {
    const p = this.getHeatById(id)
    if (p) {
      this.#heats.remove(p)
    }
  }

  /**
   * 添加heatMap
   * @param option - HeatMapOptions
   */
  async addHeatMap(option: HeatMapOptions) {
    if (option?.bounds?.length === 4 && option.url) {
      const { bounds, url, dataField, defaultValue } = option
      let geo: any
      if (typeof url === 'string') {
        const data = await fetch(url, {
          method: 'get'
        })
        geo = await data.json()
      } else {
        geo = url
      }
      if (geo?.type === 'FeatureCollection' && geo.features?.length) {
        const points = geo.features
          .filter(
            (fea: any) =>
              fea?.geometry?.type === 'Point' &&
              fea.geometry.coordinates?.length
          )
          .map((fea: any) => {
            const lon = fea.geometry.coordinates[0]
            const lat = fea.geometry.coordinates[1]
            const x = Math.round(
              ((lon - bounds[0]) / (bounds[2] - bounds[0])) * this.#width
            )
            const y = Math.round(
              ((lat - bounds[1]) / (bounds[3] - bounds[1])) * this.#height
            )
            return {
              x,
              y,
              value: isNumber(fea.properties?.[dataField ?? 'value'])
                ? fea.properties[dataField ?? 'value']
                : defaultValue ?? 0
            }
          })
        if (points?.length) {
          const values = points.map((p: any) => p.value)
          const max =
            undefined === option.max ? Math.max(...values) : option.max
          const min =
            undefined === option.min ? Math.min(...values) : option.min
          const heatMap = this.#createHeatMap(option.heatmapjs)
          heatMap.setData({
            min,
            max,
            data: points
          })
          this.#createPrimitive(option, heatMap)
        }
      }
    }
  }

  #createPrimitive(
    option: HeatMapOptions,
    heatMap: Heatmap<'value', 'x', 'y'>
  ) {
    const bounds = option.bounds
    const delta = option.delta ?? 0.001
    const h = option.minheight ?? 0
    const dh = option.height ?? 50
    const xSize = Math.floor((bounds[2] - bounds[0]) / delta)
    const ySize = Math.floor((bounds[3] - bounds[1]) / delta)
    // 点坐标
    const positons: number[] = []
    // 纹理坐标
    const sts: number[] = []
    // 索引
    const indices: number[] = []
    for (let i = 0; i < ySize; i++) {
      for (let j = 0; j < xSize; j++) {
        const lon = bounds[0] + j * delta
        const lat = bounds[3] - i * delta
        const x = Math.round((j / xSize) * this.#width)
        const y = Math.round((1 - i / ySize) * this.#height)
        const value = heatMap.getValueAt({ x, y })
        const p = Cartesian3.fromDegrees(lon, lat, h + value * dh)
        positons.push(p.x, p.y, p.z)
        sts.push(j / xSize, i / ySize)
        if (i < ySize - 1 && j < xSize - 1) {
          const x = j + xSize * i
          const y = x + xSize
          const z = x + 1
          indices.push(x, y, y + 1, x, y + 1, z)
        }
      }
    }
    const geometry = GeometryPipeline.computeNormal(
      this.#createGeometry(positons, sts, indices)
    )
    const geometryInstances = new GeometryInstance({
      geometry
    })
    const material = new Material({
      fabric: {
        type: 'Image',
        uniforms: {
          image: (heatMap as any)._renderer.canvas
        }
      }
    })
    const appearance = new MaterialAppearance({ material, translucent: true })
    const primitive = new Primitive({
      geometryInstances,
      appearance,
      asynchronous: false,
      allowPicking: false
    })
    ;(primitive as any).boundingVolume = geometry.boundingSphere
    ;(primitive as any).MoYuHeatId = option.id ?? guid()
    this.#heats.add(primitive)
  }

  #createGeometry(positions: number[], sts: number[], indices: number[]) {
    return new Geometry({
      attributes: {
        position: new GeometryAttribute({
          componentDatatype: ComponentDatatype.DOUBLE,
          componentsPerAttribute: 3,
          values: new Float64Array(positions)
        }),
        st: new GeometryAttribute({
          componentDatatype: ComponentDatatype.FLOAT,
          componentsPerAttribute: 2,
          values: new Float32Array(sts)
        })
      } as GeometryAttributes,
      indices: new Uint16Array(indices),
      primitiveType: PrimitiveType.TRIANGLES,
      boundingSphere: BoundingSphere.fromVertices(positions)
    })
  }

  #createHeatMap(config?: HeatmapConfiguration) {
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.width = `${this.#width}px`
    container.style.height = `${this.#height}px`
    container.style.display = 'none'
    this.#wrap.appendChild(container)
    const configObject: HeatmapConfiguration = config
      ? { ...config, container }
      : { container }
    return h337.create(configObject)
  }

  get #viewer() {
    return mapStoreTool.getMap()?.viewer
  }
}
