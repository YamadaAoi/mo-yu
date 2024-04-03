/*
 * @Author: zhouyinkui
 * @Date: 2023-12-29 14:02:09
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-30 13:52:21
 * @Description: 摄像机工具
 */
import { Math, Cartesian3 } from 'cesium'
import { ToolBase, ToolBaseOptions } from '@mo-yu/core'
import { mapStoreTool } from '../storeTool'
import { Position } from '../../mapViewAble'

/**
 * 旋转参数(角度)
 * heading：偏航角
 * pitch：俯仰角
 * roll：翻滚角
 */
export interface Rotation {
  /**
   * 偏航角
   */
  heading?: number
  /**
   * 俯仰角
   */
  pitch?: number
  /**
   * 翻滚角
   */
  roll?: number
}

/**
 * 相机位置角度
 */
export type CameraParam = Partial<Position> & Partial<Rotation>

/**
 * 相机事件
 */
export interface MapCameraToolEvents {
  'camera-change': {
    param: Required<CameraParam>
  }
}

/**
 * 相机操作
 * @example
 * ```ts
 * const tool = new MapCameraTool({})
 *
 * tool.enable()
 * const param = tool.getCameraParam()
 * tool.flyTo({...}, 2)
 * ```
 */
export class MapCameraTool extends ToolBase<
  ToolBaseOptions,
  MapCameraToolEvents
> {
  constructor(options: ToolBaseOptions) {
    super(options)
  }

  /**
   * 启用
   */
  enable(): void {
    this.#viewer?.camera.changed.addEventListener(this.#onCameraChange)
    this.#onCameraChange()
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.#viewer?.camera.changed.removeEventListener(this.#onCameraChange)
  }

  /**
   * 获取当前相机位置和角度
   * @returns
   */
  getCameraParam() {
    let param: Required<CameraParam> | undefined
    if (this.#viewer?.camera) {
      const camera = this.#viewer.camera
      param = {
        heading: Math.toDegrees(camera.heading),
        pitch: Math.toDegrees(camera.pitch),
        roll: Math.toDegrees(camera.roll),
        lng: Math.toDegrees(camera.positionCartographic.longitude),
        lat: Math.toDegrees(camera.positionCartographic.latitude),
        height: camera.positionCartographic.height
      }
    }
    return param
  }

  /**
   * 移动相机到指定位置和角度
   * @param param - 位置和角度参数
   * @param duration - 耗费时间
   */
  flyTo(param: CameraParam, duration = 0) {
    if (param && this.#viewer?.camera) {
      const camera = this.#viewer.camera
      const curParam = this.getCameraParam()
      if (curParam) {
        camera.flyTo({
          destination: Cartesian3.fromDegrees(
            param.lng ?? curParam.lng,
            param.lat ?? curParam.lat,
            param.height ?? curParam.height
          ),
          orientation: {
            heading: Math.toRadians(param.heading ?? curParam.heading),
            pitch: Math.toRadians(param.pitch ?? curParam.pitch),
            roll: Math.toRadians(param.roll ?? curParam.roll)
          },
          duration
        })
      }
    }
  }

  /**
   * 设置视角
   * @param param - 位置和角度参数
   */
  setView(param: CameraParam) {
    if (param && this.#viewer?.camera) {
      const camera = this.#viewer.camera
      const curParam = this.getCameraParam()
      if (curParam) {
        camera.setView({
          destination: Cartesian3.fromDegrees(
            param.lng ?? curParam.lng,
            param.lat ?? curParam.lat,
            param.height ?? curParam.height
          ),
          orientation: {
            heading: Math.toRadians(param.heading ?? curParam.heading),
            pitch: Math.toRadians(param.pitch ?? curParam.pitch),
            roll: Math.toRadians(param.roll ?? curParam.roll)
          }
        })
      }
    }
  }

  #onCameraChange = () => {
    const param = this.getCameraParam()
    if (param) {
      this.eventBus.fire('camera-change', { param })
    }
  }

  get #viewer() {
    return mapStoreTool.getMap()?.viewer
  }
}
