/*
 * @Author: zhouyinkui
 * @Date: 2023-12-15 15:07:12
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-12-29 16:38:14
 * @Description:
 */
import {
  Viewer,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  EventHelper,
  BoundingSphere,
  Cartesian3,
  CameraEventType,
  KeyboardEventModifier
} from 'cesium'
import { guid, getDefault, ToolBase } from '@mo-yu/core'
import { getDefaultOptions, MapOption } from './mapViewAble'
import { mapStoreTool } from './tools/storeTool'
import { MapSceneTool } from './tools/sceneTool'

/**
 * 地图视图事件类型
 */
interface MapViewEventType {
  /**
   * 加载完地图后触发
   */
  ready: { view: MapView }
}

/**
 * 初始化地图
 * @example
 * ```ts
 * const map = new MapView(DIVID, {
 *  id: MAPID
 * })
 *
 * map.enable()
 * map.eventBus.once('ready', e => {
 *   console.log(e.view?.id)
 * })
 * ```
 */
export class MapView extends ToolBase<MapOption, MapViewEventType> {
  /**
   * view 所渲染的 div节点/节点id
   */
  #container: HTMLElement | string
  /**
   * 地图视图组件参数
   */
  #options!: MapOption
  /**
   * 地图实例
   */
  #map!: Viewer
  /**
   * 初始场景工具
   */
  sceneTool = new MapSceneTool({})

  constructor(container: HTMLElement | string, options: MapOption) {
    super(options)
    this.#options = {
      id: options?.id ?? guid(),
      baseOption: getDefault(getDefaultOptions(), options?.baseOption)
    }
    this.#container = container
  }

  /**
   * 启用
   */
  enable(): void {
    if (this.#options.baseOption) {
      this.initMap()
    }
  }

  /**
   * 销毁
   */
  destroy(): void {
    try {
      this.sceneTool.destroy()
      mapStoreTool.deleteMap(this.id)
      this.#map.destroy()
    } catch (error) {
      console.warn(`清除异常！${error}`)
    }
  }

  protected initMap(): void {
    // 初始化 maplibre
    this.#map = new Viewer(this.#container, {
      ...this.#options.baseOption
    })
    mapStoreTool.setMap(this.id, this)
    this.#insertPopupDom()
    this.#setMouseRight()
    this.#hidecredit()
    const handler = new ScreenSpaceEventHandler(this.#map.canvas)
    handler.setInputAction(() => {
      mapStoreTool.setCurMapId(this.id)
    }, ScreenSpaceEventType.LEFT_CLICK)
    const helper = new EventHelper()
    helper.add(this.#map?.scene.globe.tileLoadProgressEvent, number => {
      if (number < 1) {
        this.eventBus.fire('ready', { view: this })
        this.sceneTool.enable()
      }
    })
  }

  /**
   * 定位到bbox
   * @param bounds - bbox
   * @param height - 高度
   */
  fitBounds(bounds: [number, number, number, number], height = 0) {
    const boundingSphere = BoundingSphere.fromPoints([
      Cartesian3.fromDegrees(bounds[0], bounds[1], height),
      Cartesian3.fromDegrees(bounds[2], bounds[3], height)
    ])
    this.#map.camera.flyToBoundingSphere(boundingSphere)
  }

  /**
   * 添加自定义弹窗图层
   */
  #insertPopupDom() {
    if (this.#map) {
      const container = this.#map.container
      if (container) {
        const cesiumContainer =
          container.getElementsByClassName('cesium-viewer')?.[0]
        if (cesiumContainer) {
          const popupContainer = document.createElement('div')
          popupContainer.className = 'cesium-viewer-popup-container'
          popupContainer.style.position = 'absolute'
          popupContainer.style.top = '0'
          popupContainer.style.left = '0'
          popupContainer.id = `cesium-viewer-popup-container-${this.id}`
          cesiumContainer.appendChild(popupContainer)
        }
      }
    }
  }

  /**
   * 自定义鼠标右键操作
   */
  #setMouseRight() {
    if (this.#map?.scene?.screenSpaceCameraController) {
      this.#map.scene.screenSpaceCameraController.tiltEventTypes = [
        CameraEventType.RIGHT_DRAG,
        CameraEventType.PINCH,
        {
          eventType: CameraEventType.LEFT_DRAG,
          modifier: KeyboardEventModifier.CTRL
        },
        {
          eventType: CameraEventType.RIGHT_DRAG,
          modifier: KeyboardEventModifier.CTRL
        }
      ]
      this.#map.scene.screenSpaceCameraController.zoomEventTypes = [
        CameraEventType.MIDDLE_DRAG,
        CameraEventType.WHEEL,
        CameraEventType.PINCH
      ]
    }
  }

  /**
   * 隐藏creditContainer
   */
  #hidecredit() {
    this.#map?.cesiumWidget.creditContainer.setAttribute(
      'style',
      'display: none'
    )
  }

  /**
   * 返回map实例
   */
  get viewer(): Viewer {
    return this.#map
  }

  /**
   * 返回mapID
   */
  get id(): string {
    return this.#options?.id
  }

  /**
   * 无视之
   */
  _green(instance: Viewer) {
    this.#map = instance
    this.#insertPopupDom()
    mapStoreTool.setMap(this.id, this)
    const handler = new ScreenSpaceEventHandler(this.#map.canvas)
    handler.setInputAction(() => {
      mapStoreTool.setCurMapId(this.id)
    }, ScreenSpaceEventType.LEFT_CLICK)
  }

  /**
   * 复用已经新建好的cesium实例，用MapView进行包裹
   * @param id - 地图唯一id
   * @param instance - 新建好的cesium实例
   * @returns
   */
  static fromInstance(id: string, instance: Viewer) {
    const mapView = new MapView('', { id })
    mapView._green(instance)
    return mapView
  }
}
