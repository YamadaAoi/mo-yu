/*
 * @Author: zhouyinkui
 * @Date: 2023-12-15 16:50:59
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-04 16:32:16
 * @Description: 3DTiles场景配置
 */
import {
  Cartesian3,
  Cartographic,
  IntersectionTests,
  Math,
  Plane,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Cesium3DTileStyle
} from 'cesium'
import { ToolBaseOptions } from '@mo-yu/core'
import { MapTileTool, TilesTransform, MapTileToolEvents } from '../tileTool'
import { Position } from '../../mapViewAble'
import { getPosiOnAction } from '../../utils/getPosi'

/**
 * 3DTiles配置事件
 */
export interface MapTileConfigToolEvents extends MapTileToolEvents {
  /**
   * 鼠标点击位置
   */
  'position-pick': {
    position: Required<Position>
  }
  /**
   * 3DTiles偏移参数变化
   */
  'position-change': {
    id: string
    position: Required<Position>
  }
  /**
   * 选中3DTiles
   */
  'tile-pick': {
    id?: string
  }
}

/**
 * 3DTiles展示配置
 * @example
 * ```ts
 * const tool = new MapTileConfigTool({})
 *
 * tool.enable()
 * tool.add3DTileset({...})
 * tool.updateTile(ID, 'lat', {...})
 * ```
 */
export class MapTileConfigTool extends MapTileTool<MapTileConfigToolEvents> {
  protected handler: ScreenSpaceEventHandler | undefined
  #style = new Cesium3DTileStyle({
    color: {
      conditions: [['true', 'color("red")']]
    }
  })
  constructor(options: ToolBaseOptions) {
    super(options)
  }

  /**
   * 启用
   */
  enable(): void {
    super.enable()
    if (this.viewer) {
      const viewer = this.viewer
      this.handler = new ScreenSpaceEventHandler(viewer.canvas)
      // 左键点击
      this.handler.setInputAction(
        (event: ScreenSpaceEventHandler.PositionedEvent) => {
          const picked = viewer.scene.pick(event.position)
          // console.log(picked)
          if (picked?.tileset) {
            // console.log(picked.getProperty('id'))
            this.eventBus.fire('tile-pick', {
              id: picked.tileset.MoYuTileId
            })
          }
          const position = getPosiOnAction(event.position)
          if (position) {
            const cartographic = Cartographic.fromCartesian(position)
            this.eventBus.fire('position-pick', {
              position: {
                lng: Math.toDegrees(cartographic.longitude),
                lat: Math.toDegrees(cartographic.latitude),
                height: cartographic.height
              }
            })
          }
        },
        ScreenSpaceEventType.LEFT_CLICK
      )
      // 左键调整横向位置
      this.handler.setInputAction(
        (event: ScreenSpaceEventHandler.PositionedEvent) => {
          const picked = viewer.scene.pick(event.position)
          if (picked?.tileset?.root?.transform) {
            viewer.scene.screenSpaceCameraController.enableRotate = false
            picked.tileset.style = this.#style
            this.handler?.setInputAction(
              (action: ScreenSpaceEventHandler.MotionEvent) => {
                // entity，primitive，3dtile上的点
                const position = getPosiOnAction(action.endPosition)
                if (position) {
                  const data = this.getPosiHPRScale(
                    picked.tileset.root.transform
                  )
                  const prev =
                    viewer.scene.globe.ellipsoid.cartesianToCartographic(
                      data[0]
                    )
                  const next =
                    viewer.scene.globe.ellipsoid.cartesianToCartographic(
                      position
                    )
                  next.height = prev.height
                  const translation =
                    viewer.scene.globe.ellipsoid.cartographicToCartesian(next)
                  const modelMatrix = this.createMatrix(
                    translation,
                    data[1],
                    data[2]
                  )
                  picked.tileset.root.transform = modelMatrix
                  this.eventBus.fire('position-change', {
                    id: picked.tileset.MoYuTileId,
                    position: {
                      lng: Math.toDegrees(next.longitude),
                      lat: Math.toDegrees(next.latitude),
                      height: next.height
                    }
                  })
                }
              },
              ScreenSpaceEventType.MOUSE_MOVE
            )
            this.handler?.setInputAction(() => {
              viewer.scene.screenSpaceCameraController.enableRotate = true
              picked.tileset.style = undefined
              this.handler?.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE)
              this.handler?.removeInputAction(ScreenSpaceEventType.LEFT_UP)
            }, ScreenSpaceEventType.LEFT_UP)
          }
        },
        ScreenSpaceEventType.LEFT_DOWN
      )
      // 右键调整纵向高度
      this.handler.setInputAction(
        (event: ScreenSpaceEventHandler.PositionedEvent) => {
          const picked = viewer.scene.pick(event.position)
          if (picked?.tileset?.root?.transform) {
            viewer.scene.screenSpaceCameraController.enableInputs = false
            picked.tileset.style = this.#style
            this.handler?.setInputAction(
              (action: ScreenSpaceEventHandler.MotionEvent) => {
                const ray = viewer.scene.camera.getPickRay(action.endPosition)
                if (ray) {
                  const data = this.getPosiHPRScale(
                    picked.tileset.root.transform
                  )
                  const diff = Cartesian3.subtract(
                    viewer.scene.camera.position,
                    data[0],
                    new Cartesian3()
                  )
                  const planeNormal = Cartesian3.normalize(diff, diff)
                  const plane = Plane.fromPointNormal(data[0], planeNormal)
                  const nextCartesian = IntersectionTests.rayPlane(ray, plane)
                  const next =
                    viewer.scene.globe.ellipsoid.cartesianToCartographic(
                      nextCartesian
                    )
                  const prev =
                    viewer.scene.globe.ellipsoid.cartesianToCartographic(
                      data[0]
                    )
                  prev.height = next.height
                  const translation =
                    viewer.scene.globe.ellipsoid.cartographicToCartesian(prev)
                  const modelMatrix = this.createMatrix(
                    translation,
                    data[1],
                    data[2]
                  )
                  picked.tileset.root.transform = modelMatrix
                  this.eventBus.fire('position-change', {
                    id: picked.tileset.MoYuTileId,
                    position: {
                      lng: Math.toDegrees(prev.longitude),
                      lat: Math.toDegrees(prev.latitude),
                      height: prev.height
                    }
                  })
                }
              },
              ScreenSpaceEventType.MOUSE_MOVE
            )
            this.handler?.setInputAction(() => {
              viewer.scene.screenSpaceCameraController.enableInputs = true
              picked.tileset.style = undefined
              this.handler?.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE)
              this.handler?.removeInputAction(ScreenSpaceEventType.LEFT_UP)
            }, ScreenSpaceEventType.RIGHT_UP)
          }
        },
        ScreenSpaceEventType.RIGHT_DOWN
      )
    }
  }

  /**
   * 销毁
   */
  destroy(): void {
    super.destroy()
    this.handler?.destroy()
  }

  /**
   * 清除所有3dTiles
   */
  clear() {
    super.clear()
    this.eventBus.fire('tile-pick', {})
  }

  /**
   * 清除指定3dTiles
   * @param id - 3DTiles Id
   */
  deleteTile(id: string) {
    const tile = this.getTileById(id)
    if (tile) {
      this.tiles.remove(tile)
    }
  }

  /**
   * 更新3DTiles偏移、旋转，缩放参数
   * @param id - 3DTiles Id
   * @param key - 参数
   * @param params - 所有参数值
   */
  updateTile(id: string, key: string, params: TilesTransform) {
    const tile = this.getTileById(id)
    if (tile) {
      const data = this.getPosiHPRScale(tile.root.transform)
      if (['lng', 'lat', 'height'].includes(key)) {
        const translation = this.updateTranslation(data[0], params)
        const modelMatrix = this.createMatrix(translation, data[1], data[2])
        tile.root.transform = modelMatrix
        this.viewer?.zoomTo(tile)
      } else if (['heading', 'pitch', 'roll'].includes(key)) {
        const hpr = this.updateHPR(data[1], params)
        const modelMatrix = this.createMatrix(data[0], hpr, data[2])
        tile.root.transform = modelMatrix
      } else if (key === 'scale') {
        const scale = this.createScale(params.scale)
        const modelMatrix = this.createMatrix(data[0], data[1], scale)
        tile.root.transform = modelMatrix
      }
    }
  }
}
