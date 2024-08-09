/*
 * @Author: zhouyinkui
 * @Date: 2024-04-11 13:36:17
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-08-09 16:03:20
 * @Description: 点数据效果
 */
import {
  ToolBase,
  ToolBaseOptions,
  debounce,
  isNull,
  isNumber
} from '@mo-yu/core'
import {
  BillboardCollection,
  BoundingSphere,
  Cartesian3,
  Color,
  HeadingPitchRange,
  LabelCollection,
  Material,
  PrimitiveCollection,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Math
} from 'cesium'
import { mapStoreTool } from '../storeTool'
import {
  BillboardOption,
  createBillboardOptions
} from '../../core/geo/primitive/billboard'
import { LabelOption, createLabelOptions } from '../../core/geo/primitive/label'
import {
  CylinderOption,
  createCylinder
} from '../../core/geo/primitive/cylinder'
import { cartesian3ToLngLat } from '../../utils/coordTranform'
import { ClusterTool, ClusterToolOptions } from '../../support/cluster'

interface CylinderConfig extends CylinderOption {
  lengthField?: string
  ratio?: number
}

interface CustomBillboard {
  style: BillboardOption
  cluster?: ClusterToolOptions
}

interface CustomLabel {
  style: LabelOption & { field?: string }
  cluster?: ClusterToolOptions
}

interface CustomCylinder {
  style: CylinderConfig
}

interface Collection {
  points: any[]
  billboards?: BillboardCollection
  billboardCluster?: ClusterTool
  labels?: LabelCollection
  labelCluster?: ClusterTool
  cylinders?: PrimitiveCollection
}

/**
 * 点数据参数
 */
export interface PointsOption {
  id: string
  /**
   * geojson请求地址 或 geojson对象
   */
  url: string | object
  custom?: {
    /**
     * 渲染billboard参数
     */
    billboard?: CustomBillboard
    /**
     * 渲染label参数
     */
    label?: CustomLabel
    /**
     * 渲染cylinder参数（Todo）
     */
    cylinder?: CustomCylinder
  }
}

export interface PointsToolEvents {
  /**
   * 选取最上层point属性
   */
  'pick-point': {
    properties: any
  }
  /**
   * 选取所有point属性
   */
  'pick-point-all': {
    properties: any[]
  }
}

/**
 * 使用primitive添加点位数据，性能更好
 * 可以选择把点位渲染为billboard、label，聚合功能可选
 * @example
 * ```ts
 * const tool = new PointsTool({})
 *
 * tool.enable()
 * tool.addPoints(config)
 * ```
 */
export class PointsTool extends ToolBase<ToolBaseOptions, PointsToolEvents> {
  static prefix = 'PointsTool'
  #points = new PrimitiveCollection()
  #dataMap = new Map<string, Collection>()
  #handler: ScreenSpaceEventHandler | undefined
  constructor(options: ToolBaseOptions) {
    super(options)
  }

  /**
   * 启用
   */
  enable(): void {
    this.#viewer?.scene.primitives.add(this.#points)
    this.#handler = new ScreenSpaceEventHandler(this.#viewer.canvas)
    this.#handler.setInputAction(
      this.#handlePick,
      ScreenSpaceEventType.LEFT_CLICK
    )
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.clear()
    this.#viewer?.scene.primitives.remove(this.#points)
    this.#handler?.destroy()
  }

  /**
   * 清除
   */
  clear() {
    this.#dataMap.forEach(val => {
      this.#removeCollection(val)
    })
    this.#dataMap.clear()
  }

  /**
   * 根据id获取点位数据
   * @param id - 唯一Id
   * @returns
   */
  getPointsById(id: string) {
    return this.#dataMap.get(id)
  }

  /**
   * 定位至点位集合
   * @param id - 唯一Id
   */
  locatePoints(id: string) {
    const c = this.getPointsById(id)
    const primitives = c?.billboards ?? c?.labels
    const len = primitives?.length
    if (len) {
      const arr: Cartesian3[] = []
      for (let i = 0; i < len; ++i) {
        const b = primitives.get(i)
        arr.push(b.position)
      }
      const boundingSphere = BoundingSphere.fromPoints(arr)
      if (boundingSphere) {
        this.#viewer?.camera.flyToBoundingSphere(boundingSphere)
      }
    }
  }

  /**
   * 点位集合显隐
   * @param id - 唯一Id
   * @param show - 显隐
   */
  togglePoints(id: string, show: boolean) {
    const c = this.getPointsById(id)
    if (c?.billboards) {
      c.billboards.show = show
    }
    if (c?.labels) {
      c.labels.show = show
    }
    if (c?.cylinders) {
      c.cylinders.show = show
    }
  }

  /**
   * 移除点位集合
   * @param id - 唯一Id
   */
  removePoints(id: string) {
    if (id) {
      const c = this.getPointsById(id)
      if (c) {
        this.#removeCollection(c)
        this.#dataMap.delete(id)
      }
    }
  }

  /**
   * 添加点位集合
   * @param option - 点位参数
   */
  async addPoints(option: PointsOption) {
    const { id, url } = option
    const temp = this.getPointsById(id)
    if (!temp) {
      const { points, lnglats } = await this.#getPoints(url, id)
      if (
        points.length &&
        (option.custom?.billboard?.style ||
          option.custom?.label?.style ||
          option.custom?.cylinder?.style)
      ) {
        const c: Collection = {
          points
        }
        if (option.custom.billboard) {
          c.billboards = this.#points.add(
            new BillboardCollection({ scene: this.#viewer.scene })
          )
        }
        if (option.custom.label) {
          c.labels = this.#points.add(
            new LabelCollection({ scene: this.#viewer.scene })
          )
        }
        if (option.custom.cylinder) {
          c.cylinders = this.#points.add(new PrimitiveCollection())
        }
        this.#dataMap.set(id, c)
        // const results = await getPointsOnTerrain(lnglats)
        const results = Cartesian3.fromDegreesArray(lnglats.flat())
        points.forEach((fea, i) => {
          this.#addPoint(fea, i, results[i], option)
        })
        this.#createCluster(option, c)
      }
    }
  }

  #removeCollection(c: Collection) {
    if (c?.billboardCluster) {
      this.#points.remove(c.billboardCluster)
    }
    if (c?.labelCluster) {
      this.#points.remove(c.labelCluster)
    }
    if (c?.billboards) {
      this.#points.remove(c.billboards)
    }
    if (c?.labels) {
      this.#points.remove(c.labels)
    }
    if (c?.cylinders) {
      this.#points.remove(c.cylinders)
    }
  }

  #createCluster(option: PointsOption, c: Collection) {
    if (option.custom?.billboard?.cluster && c.billboards) {
      const cluster: ClusterTool = this.#points.add(
        new ClusterTool(option.custom.billboard.cluster)
      )
      cluster.billboardCollection = c.billboards
      cluster.enable()
      c.billboardCluster = cluster
    }
    if (option.custom?.label?.cluster && c.labels) {
      const cluster: ClusterTool = this.#points.add(
        new ClusterTool(option.custom.label.cluster)
      )
      cluster.labelCollection = c.labels
      cluster.enable()
      c.labelCluster = cluster
    }
  }

  #addPoint(fea: any, idx: number, point: Cartesian3, option: PointsOption) {
    if (option.custom?.billboard) {
      this.#addBillboard(
        option.id,
        point,
        idx,
        fea.properties,
        option.custom.billboard
      )
    }
    if (option.custom?.label) {
      this.#addLabel(option.id, point, idx, fea.properties, option.custom.label)
    }
    if (option.custom?.cylinder) {
      this.#addCylinder(
        option.id,
        point,
        idx,
        fea.properties,
        option.custom.cylinder
      )
    }
  }

  #addLabel(
    id: string,
    position: Cartesian3,
    idx: number,
    properties: any,
    option: CustomLabel
  ) {
    const { text: t, field, ...rest } = option.style
    let text = t
    if (isNull(text) && field) {
      const val = properties?.[field]
      if (!isNull(val)) {
        text = `${val}`
      }
    }
    this.getPointsById(id)?.labels?.add(
      createLabelOptions({
        ...rest,
        text,
        position,
        id: `${PointsTool.prefix}#${id}#${idx}`
      })
    )
  }

  #addBillboard(
    id: string,
    position: Cartesian3,
    idx: number,
    properties: any,
    option: CustomBillboard
  ) {
    this.getPointsById(id)?.billboards?.add(
      createBillboardOptions({
        ...option.style,
        position,
        id: `${PointsTool.prefix}#${id}#${idx}`
      })
    )
  }

  #addCylinder(
    id: string,
    point: Cartesian3,
    idx: number,
    properties: any,
    option: CustomCylinder
  ) {
    const [lon, lat, height] = cartesian3ToLngLat(point)
    const { lengthField, ratio, ...rest } = option.style
    let length = 500
    if (lengthField && isNumber(properties?.[lengthField])) {
      length = properties[lengthField] * (ratio ?? 1)
    } else if (undefined !== option.style.length) {
      length = option.style.length
    }
    const position = Cartesian3.fromDegrees(lon, lat, height + length / 2)
    this.getPointsById(id)?.cylinders?.add(
      createCylinder({
        ...rest,
        id: `${PointsTool.prefix}#${id}#${idx}`,
        length,
        position,
        material: new Material({
          fabric: {
            type: 'CylinderMaterial',
            uniforms: {
              color: Color.RED,
              length
            },
            source: /*glsl*/ `czm_material czm_getMaterial(czm_materialInput materialInput)
            {
              czm_material material = czm_getDefaultMaterial(materialInput);
              vec4 positionEC = vec4(-materialInput.positionToEyeEC, 1);
              vec4 modelPosition = czm_inverseModelView * positionEC; // transforms from eye coordinates to model coordinates
              float l = sqrt(pow(modelPosition.x,2.0) + pow(modelPosition.y,2.0) + pow(modelPosition.z,2.0)); // 距离模型坐标系原点的距离
              float alpha = fract((abs(l - length)) / length);
              material.alpha = color.a * alpha;
              material.diffuse = color.rgb;
              return material;
            }`
          },
          translucent: true
        })
      })
    )
  }

  #handlePick = debounce((event: ScreenSpaceEventHandler.PositionedEvent) => {
    if (event?.position) {
      const picked = this.#viewer.scene.drillPick(event.position)
      if (picked?.length) {
        // 点击到未聚合点
        const ps1 = picked.filter(p => {
          return p?.id?.startsWith?.(`${PointsTool.prefix}#`)
        })
        if (ps1.length) {
          const properties = ps1.map(p => {
            let property: any = {}
            const arr = p.id.split('#')
            const temp = this.getPointsById(arr[1])
            const fea = temp?.points?.[arr[2]]
            if (fea) {
              property = fea.properties
            }
            return property
          })
          if (properties.length) {
            this.eventBus.fire('pick-point', {
              properties: properties[0]
            })
            this.eventBus.fire('pick-point-all', {
              properties
            })
          }
        }
        // 点击到聚合点
        const top = picked.find(p => {
          return p?.id?.startsWith?.(`${ClusterTool.prefix}#`)
        })
        if (top) {
          const str = top.id.slice(top.id.indexOf('#') + 1)
          const ids = str.split(',')
          if (ids.length) {
            this.#locateIds(ids)
          }
        }
      }
    }
  })

  #locateIds(ids: string[]) {
    const id = ids?.[0]?.split?.('#')?.[1]
    if (id) {
      const c = this.getPointsById(id)
      const primitives = c?.billboards ?? c?.labels
      const len = primitives?.length
      if (len) {
        const arr: Cartesian3[] = []
        for (let i = 0; i < len; ++i) {
          const b = primitives.get(i)
          if (ids.includes(b.id)) {
            arr.push(b.position)
          }
        }
        const boundingSphere = BoundingSphere.fromPoints(arr)
        if (boundingSphere) {
          this.#viewer?.camera.flyToBoundingSphere(boundingSphere, {
            duration: 1,
            offset: new HeadingPitchRange(
              Math.toRadians(0.0),
              Math.toRadians(-90.0),
              300
            )
          })
        }
      }
    }
  }

  async #getPoints(url: string | object, id: string) {
    let geo: any
    const points: any[] = []
    const lnglats: any[] = []
    if (typeof url === 'string') {
      const data = await fetch(url, {
        method: 'get'
      })
      geo = await data.json()
    } else {
      geo = url
    }
    if (geo?.type === 'FeatureCollection' && geo.features?.length) {
      geo.features.forEach((fea: any) => {
        if (
          fea?.geometry?.type === 'Point' &&
          fea.geometry.coordinates &&
          fea.geometry.coordinates.length === 2
        ) {
          const properties = fea.properties ?? {}
          points.push({
            ...fea,
            properties: { ...properties, MoYuGeoId: id }
          })
          lnglats.push(fea.geometry.coordinates)
        }
      })
    }
    return {
      points,
      lnglats
    }
  }

  get #viewer() {
    return mapStoreTool.getMap()?.viewer
  }
}
