/*
 * @Author: zhouyinkui
 * @Date: 2023-12-15 15:08:27
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-12-15 15:59:33
 * @Description: cesium实例保存
 */
import { ToolBase, ToolBaseOptions } from '@mo-yu/core'
import { MapView } from '../../mapView'

/**
 * 地图实例存储工具事件
 */
interface MapStoreToolEvents {
  /**
   * 当前地图实例切换事件
   */
  'cur-viewer-change': {
    /**
     * 发送当前地图实例Id
     */
    mapId: string
  }
}

class MapStoreTool extends ToolBase<ToolBaseOptions, MapStoreToolEvents> {
  #curMapId = ''
  #store: Record<string, MapView> = {}

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
    //
  }

  /**
   * 创建地图实例时，应当保存一份地图实例
   * @param mapId - 地图唯一id
   * @param map - 地图实例
   */
  setMap(mapId: string, map: MapView) {
    this.setCurMapId(mapId)
    this.#store[mapId] = map
  }

  /**
   * 删除地图实例
   * @param mapId - 地图唯一id
   */
  deleteMap(mapId: string) {
    if (this.#store[mapId]) {
      delete this.#store[mapId]
    }
  }

  /**
   * 根据地图id获取地图实例
   * @param mapId - 地图唯一id
   * @returns
   */
  getMap(mapId?: string) {
    if (mapId) {
      return this.#store[mapId]
    } else {
      return this.#store[this.#curMapId]
    }
  }

  /**
   * 设置获得焦点的地图id
   * @param mapId - 地图唯一id
   */
  setCurMapId(mapId: string) {
    if (mapId && mapId !== this.#curMapId) {
      this.#curMapId = mapId
      this.eventBus.fire('cur-viewer-change', {
        mapId
      })
    }
  }

  get curMapId() {
    return this.#curMapId
  }

  get curMap() {
    return this.getMap(this.curMapId)
  }
}

/**
 * 地图实例存储对象
 */
export const mapStoreTool = new MapStoreTool({})
