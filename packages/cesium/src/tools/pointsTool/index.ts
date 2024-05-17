/*
 * @Author: zhouyinkui
 * @Date: 2024-04-11 13:36:17
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-04-12 13:10:01
 * @Description: 点数据效果
 */
import { ToolBase, ToolBaseOptions, isNumber } from '@mo-yu/core'
import { Cartesian3, Color, Material, PrimitiveCollection } from 'cesium'
import { mapStoreTool } from '../storeTool'
import {
  CylinderOption,
  createCylinder
} from '../../core/geo/primitive/cylinder'
import { getPosiOnMap } from '../../utils/getPosi'
import { cartesian3ToLngLat } from '../../utils/coordTranform'

interface CylinderConfig extends CylinderOption {
  lengthField?: string
  ratio?: number
}

export interface PointsOption {
  id: string
  url: string | object
  cylinder?: CylinderConfig
}

export interface PointsToolEvents {}

export class PointsTool extends ToolBase<ToolBaseOptions, PointsToolEvents> {
  #cylinders = new PrimitiveCollection()
  constructor(options: ToolBaseOptions) {
    super(options)
  }

  enable(): void {
    this.#viewer?.scene.primitives.add(this.#cylinders)
  }

  destroy(): void {
    this.#viewer?.scene.primitives.remove(this.#cylinders)
  }

  clear() {
    //
  }

  async addPoints(option: PointsOption) {
    const { url } = option
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
      const promises = geo.features
        .filter(
          (fea: any) =>
            fea?.geometry?.type === 'Point' && fea.geometry.coordinates?.length
        )
        .map((fea: any) => this.#addPoint(fea, option))
      await Promise.allSettled(promises)
    }
  }

  async #addPoint(fea: any, option: PointsOption) {
    const carte = Cartesian3.fromDegrees(
      fea.geometry.coordinates[0],
      fea.geometry.coordinates[1]
    )
    const point = await getPosiOnMap(carte)
    if (option.cylinder) {
      this.#addCylinder(point, fea.properties, option.cylinder)
    }
  }

  #addCylinder(point: Cartesian3, properties: any, cylinder: CylinderConfig) {
    const [lon, lat, height] = cartesian3ToLngLat(point)
    const { lengthField, ratio, ...rest } = cylinder
    let length = 500
    if (lengthField && isNumber(properties?.[lengthField])) {
      length = properties[lengthField] * (ratio ?? 1)
    } else if (undefined !== cylinder.length) {
      length = cylinder.length
    }
    const position = Cartesian3.fromDegrees(lon, lat, height + length / 2)
    this.#cylinders.add(
      createCylinder({
        ...rest,
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

  get #viewer() {
    return mapStoreTool.getMap()?.viewer
  }
}
