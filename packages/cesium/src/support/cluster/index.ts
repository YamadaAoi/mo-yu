/*
 * @Author: zhouyinkui
 * @Date: 2024-08-06 13:21:19
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-08-09 16:35:45
 * @Description: 聚合
 */
import { isNumber, ToolBase, ToolBaseOptions } from '@mo-yu/core'
import {
  BillboardCollection,
  defaultValue,
  defined,
  Event,
  EllipsoidalOccluder,
  SceneMode,
  Billboard,
  Matrix4,
  Cartesian3,
  Cartesian2,
  LabelCollection,
  Label,
  PointPrimitive,
  BoundingRectangle,
  PointPrimitiveCollection
} from 'cesium'
import KDBush from 'kdbush'
import { mapStoreTool } from '../../tools/storeTool'
import {
  BillboardOption,
  createBillboardOptions
} from '../../core/geo/primitive/billboard'
import { createLabelOptions, LabelOption } from '../../core/geo/primitive/label'
import { createPoint } from '../../core/geo/primitive/point'

/**
 * 聚合参数
 */
export interface ClusterToolOptions extends ToolBaseOptions {
  /**
   * cesium原生聚合参数
   */
  options: {
    enabled?: boolean
    pixelRange?: number
    minimumClusterSize?: number
    clusterBillboards?: boolean
    clusterLabels?: boolean
    clusterPoints?: boolean
    show?: boolean
  }
  /**
   * 聚合后billboard样式
   */
  billboard?: BillboardOption
  /**
   * 聚合后label样式
   */
  label?: LabelOption
}

/**
 * 参考cesium原生packages/engine/Source/DataSources/EntityCluster.js魔改primitive版本
 * （目前仅供内部PointsTool使用）
 */
export class ClusterTool extends ToolBase<ClusterToolOptions, any> {
  static prefix = 'ClusterTool'
  #_enabled: boolean
  /** The pixel range to extend the screen space bounding box. */
  #_pixelRange: number
  /** The minimum number of screen space objects that can be clustered. */
  #_minimumClusterSize: number
  /** 是否合并图标 */
  #_clusterBillboards: boolean
  /** 是否合并标签 */
  #_clusterLabels: boolean
  /** 是否合并点 */
  #_clusterPoints: boolean

  /** 待聚合标签 */
  #_labelCollection: LabelCollection | undefined
  /** 待聚合图标 */
  #_billboardCollection: BillboardCollection | undefined
  /** 待聚合点 */
  #_pointCollection: PointPrimitiveCollection | undefined

  /** 合并数量标签 */
  #_clusterLabelCollection = new LabelCollection({ scene: this.#viewer.scene })
  /** 合并后展示图标 */
  #_clusterBillboardCollection = new BillboardCollection({
    scene: this.#viewer.scene
  })
  /** 合并后展示点 */
  #_clusterPointCollection = new PointPrimitiveCollection()

  #_collectionIndicesByEntity: any = {}

  #_previousClusters: any[] = []
  #_previousHeight = this.#viewer?.scene.camera.positionCartographic.height

  #_enabledDirty = false
  #_clusterDirty = false

  #_removeEventListener: Event.RemoveCallback | undefined

  #_clusterEvent = new Event()

  #pointBoundinRectangleScratch = new BoundingRectangle()
  #totalBoundingRectangleScratch = new BoundingRectangle()
  #neighborBoundingRectangleScratch = new BoundingRectangle()
  #labelBoundingBoxScratch = new BoundingRectangle()

  /** 是否成功计算过聚合 */
  #clustered = false

  show: boolean
  constructor(o: ClusterToolOptions) {
    super(o)
    this.#_enabled = defaultValue(o.options.enabled, false)
    this.#_pixelRange = defaultValue(o.options.pixelRange, 80)
    this.#_minimumClusterSize = defaultValue(o.options.minimumClusterSize, 2)
    this.#_clusterBillboards = defaultValue(o.options.clusterBillboards, true)
    this.#_clusterLabels = defaultValue(o.options.clusterLabels, true)
    this.#_clusterPoints = defaultValue(o.options.clusterPoints, true)
    this.show = defaultValue(o.options.show, true)
  }

  enable(): void {
    this.#viewer?.scene.primitives.add(this.#_clusterLabelCollection)
    this.#viewer?.scene.primitives.add(this.#_clusterBillboardCollection)
    this.#viewer?.scene.primitives.add(this.#_clusterPointCollection)
    this.#_removeEventListener =
      this.#viewer?.scene.camera.changed.addEventListener(
        this.#declutterCallback
      )
  }

  destroy(): void {
    this.#_clusterLabelCollection.removeAll()
    this.#_clusterBillboardCollection.removeAll()
    this.#_clusterPointCollection.removeAll()
    this.#viewer?.scene.primitives.remove(this.#_clusterLabelCollection)
    this.#viewer?.scene.primitives.remove(this.#_clusterBillboardCollection)
    this.#viewer?.scene.primitives.remove(this.#_clusterPointCollection)

    if (defined(this.#_removeEventListener)) {
      this.#_removeEventListener()
      this.#_removeEventListener = undefined
    }
  }

  update() {
    if (!this.show) {
      return
    }

    if (this.#_enabledDirty) {
      this.#_enabledDirty = false
      this.#updateEnable()
      this.#_clusterDirty = true
    }

    if (this.#_clusterDirty || !this.#clustered) {
      this.#_clusterDirty = false
      this.#declutterCallback()
    }
  }

  #updateEnable() {
    if (this.enabled) {
      return
    }

    this.#_clusterLabelCollection.removeAll()
    this.#_clusterBillboardCollection.removeAll()
    this.#_clusterPointCollection.removeAll()

    this.#disableCollectionClustering(this.#_labelCollection)
    this.#disableCollectionClustering(this.#_billboardCollection)
    this.#disableCollectionClustering(this.#_pointCollection)
  }

  #disableCollectionClustering(
    collection?:
      | BillboardCollection
      | LabelCollection
      | PointPrimitiveCollection
  ) {
    if (!defined(collection)) {
      return
    }

    const length = collection.length
    for (let i = 0; i < length; ++i) {
      ;(collection.get(i) as any).clusterShow = true
    }
  }

  #expandBoundingBox(bbox: any, pixelRange: number) {
    bbox.x -= pixelRange
    bbox.y -= pixelRange
    bbox.width += pixelRange * 2.0
    bbox.height += pixelRange * 2.0
  }

  #getScreenSpacePositions(
    collection:
      | BillboardCollection
      | LabelCollection
      | PointPrimitiveCollection,
    points: any[],
    occluder: EllipsoidalOccluder
  ) {
    const scene = this.#viewer?.scene
    if (!scene || !defined(collection)) {
      return
    }
    const length = collection.length
    for (let i = 0; i < length; ++i) {
      const item: any = collection.get(i)
      item.clusterShow = false
      if (
        !item.show ||
        (scene.mode === SceneMode.SCENE3D &&
          !occluder.isPointVisible(item.position))
      ) {
        continue
      }
      const coord = item.computeScreenSpacePosition(scene)
      if (!defined(coord)) {
        continue
      }

      points.push({
        index: i,
        collection,
        clustered: false,
        coord
      })
    }
  }

  #addCluster(position: Cartesian3, numPoints: number, ids: any) {
    const id = `${ClusterTool.prefix}#${ids.join(',')}`
    let bo: BillboardOption = {
      show: false,
      position,
      id
    }
    if (this.options.billboard) {
      bo = { ...this.options.billboard, position, id }
    }
    let lo: LabelOption = {
      show: true,
      position,
      text: numPoints.toLocaleString(),
      id
    }
    if (this.options.label) {
      lo = {
        ...this.options.label,
        position,
        text: numPoints.toLocaleString(),
        id
      }
    }
    const cluster = {
      billboard: this.#_clusterBillboardCollection.add(
        createBillboardOptions(bo)
      ),
      label: this.#_clusterLabelCollection.add(createLabelOptions(lo)),
      point: this.#_clusterPointCollection.add(
        createPoint({ show: false, position })
      )
    }
    this.#_clusterEvent.raiseEvent(ids, cluster)
  }

  #getBoundingBox(
    item: any,
    coord: any,
    pixelRange: number,
    result: BoundingRectangle
  ) {
    if (defined(item._labelCollection) && this.#_clusterLabels) {
      result = (Label as any).getScreenSpaceBoundingBox(item, coord, result)
    } else if (defined(item._billboardCollection) && this.#_clusterBillboards) {
      result = (Billboard as any).getScreenSpaceBoundingBox(item, coord, result)
    } else if (
      defined(item._pointPrimitiveCollection) &&
      this.#_clusterPoints
    ) {
      result = (PointPrimitive as any).getScreenSpaceBoundingBox(
        item,
        coord,
        result
      )
    }

    this.#expandBoundingBox(result, pixelRange)

    if (
      this.#_clusterLabels &&
      !defined(item._labelCollection) &&
      defined(item.id) &&
      this.#hasLabelIndex(item.id.id) &&
      defined(item.id._label)
    ) {
      const labelIndex = this.#_collectionIndicesByEntity[item.id.id].labelIndex
      const label = this.#_labelCollection?.get(labelIndex)
      const labelBBox = (Label as any).getScreenSpaceBoundingBox(
        label,
        coord,
        this.#labelBoundingBoxScratch
      )
      this.#expandBoundingBox(labelBBox, pixelRange)
      result = BoundingRectangle.union(result, labelBBox, result)
    }

    return result
  }

  #hasLabelIndex(entityId: string) {
    return (
      defined(this.#_collectionIndicesByEntity[entityId]) &&
      defined(this.#_collectionIndicesByEntity[entityId].labelIndex)
    )
  }

  #addNonClusteredItem(item: any) {
    item.clusterShow = true

    if (
      !defined(item._labelCollection) &&
      defined(item.id) &&
      this.#hasLabelIndex(item.id.id) &&
      defined(item.id._label)
    ) {
      const labelIndex = this.#_collectionIndicesByEntity[item.id.id].labelIndex
      const label: any = this.#_labelCollection?.get(labelIndex)
      label.clusterShow = true
    }
  }

  #declutterCallback = (amount?: number) => {
    const scene = this.#viewer?.scene
    if (!scene || (defined(amount) && amount < 0.05) || !this.#_enabled) {
      return
    }
    if (
      (!defined(this.#_labelCollection) &&
        !defined(this.#_billboardCollection) &&
        !defined(this.#_pointCollection)) ||
      (!this.#_clusterLabels &&
        !this.#_clusterBillboards &&
        !this.#_clusterPoints)
    ) {
      return
    }

    this.#_clusterLabelCollection.removeAll()
    this.#_clusterBillboardCollection.removeAll()
    this.#_clusterPointCollection.removeAll()

    const pixelRange = this.#_pixelRange
    const minimumClusterSize = this.#_minimumClusterSize

    const clusters = this.#_previousClusters
    const newClusters: any[] = []

    const previousHeight = this.#_previousHeight
    const currentHeight = scene.camera.positionCartographic.height

    const ellipsoid = scene.ellipsoid
    const cameraPosition = scene.camera.positionWC
    const occluder = new EllipsoidalOccluder(ellipsoid, cameraPosition)

    const points: any[] = []
    if (this.#_clusterLabels) {
      this.#getScreenSpacePositions(this.#_labelCollection!, points, occluder)
    }
    if (this.#_clusterBillboards) {
      this.#getScreenSpacePositions(
        this.#_billboardCollection!,
        points,
        occluder
      )
    }
    if (this.#_clusterPoints) {
      this.#getScreenSpacePositions(this.#_pointCollection!, points, occluder)
    }

    let i
    let j
    let length
    let bbox
    let neighbors
    let neighborLength
    let neighborIndex
    let neighborPoint
    let ids
    let numPoints

    let collection
    let collectionIndex

    if (points.length > 0) {
      const index = new KDBush(points.length, 64, Uint32Array)
      for (let p = 0; p < points.length; ++p) {
        index.add(points[p].coord.x, points[p].coord.y)
      }
      index.finish()

      if (currentHeight < previousHeight) {
        length = clusters.length
        for (i = 0; i < length; ++i) {
          const cluster = clusters[i]

          if (!occluder.isPointVisible(cluster.position)) {
            continue
          }

          const coord = (Billboard as any)._computeScreenSpacePosition(
            Matrix4.IDENTITY,
            cluster.position,
            Cartesian3.ZERO,
            Cartesian2.ZERO,
            scene
          )
          if (!defined(coord)) {
            continue
          }

          const factor = 1.0 - currentHeight / previousHeight
          let width = (cluster.width = cluster.width * factor)
          let height = (cluster.height = cluster.height * factor)

          width = Math.max(width, cluster.minimumWidth)
          height = Math.max(height, cluster.minimumHeight)

          const minX = coord.x - width * 0.5
          const minY = coord.y - height * 0.5
          const maxX = coord.x + width
          const maxY = coord.y + height

          neighbors = index.range(minX, minY, maxX, maxY)
          neighborLength = neighbors.length
          numPoints = 0
          ids = []

          for (j = 0; j < neighborLength; ++j) {
            neighborIndex = neighbors[j]
            neighborPoint = points[neighborIndex]
            if (!neighborPoint.clustered) {
              ++numPoints

              collection = neighborPoint.collection
              collectionIndex = neighborPoint.index
              ids.push(collection.get(collectionIndex).id)
            }
          }

          if (numPoints >= minimumClusterSize) {
            this.#addCluster(cluster.position, numPoints, ids)
            newClusters.push(cluster)

            for (j = 0; j < neighborLength; ++j) {
              points[neighbors[j]].clustered = true
            }
          }
        }
      }

      length = points.length
      for (i = 0; i < length; ++i) {
        const point = points[i]
        if (point.clustered) {
          this.#clustered = true
          continue
        }

        point.clustered = true

        collection = point.collection
        collectionIndex = point.index

        const item = collection.get(collectionIndex)
        bbox = this.#getBoundingBox(
          item,
          point.coord,
          pixelRange,
          this.#pointBoundinRectangleScratch
        )
        if (isNumber(bbox.x)) {
          this.#clustered = true
        }
        const totalBBox = BoundingRectangle.clone(
          bbox,
          this.#totalBoundingRectangleScratch
        )

        neighbors = index.range(
          bbox.x,
          bbox.y,
          bbox.x + bbox.width,
          bbox.y + bbox.height
        )
        neighborLength = neighbors.length

        const clusterPosition = Cartesian3.clone(item.position)
        numPoints = 1
        ids = [item.id]

        for (j = 0; j < neighborLength; ++j) {
          neighborIndex = neighbors[j]
          neighborPoint = points[neighborIndex]
          if (!neighborPoint.clustered) {
            const neighborItem = neighborPoint.collection.get(
              neighborPoint.index
            )
            const neighborBBox = this.#getBoundingBox(
              neighborItem,
              neighborPoint.coord,
              pixelRange,
              this.#neighborBoundingRectangleScratch
            )

            Cartesian3.add(
              neighborItem.position,
              clusterPosition,
              clusterPosition
            )

            BoundingRectangle.union(totalBBox, neighborBBox, totalBBox)
            ++numPoints

            ids.push(neighborItem.id)
          }
        }

        if (numPoints >= minimumClusterSize) {
          const position = Cartesian3.multiplyByScalar(
            clusterPosition,
            1.0 / numPoints,
            clusterPosition
          )
          this.#addCluster(position, numPoints, ids)
          newClusters.push({
            position: position,
            width: totalBBox.width,
            height: totalBBox.height,
            minimumWidth: bbox.width,
            minimumHeight: bbox.height
          })

          for (j = 0; j < neighborLength; ++j) {
            points[neighbors[j]].clustered = true
          }
        } else {
          this.#addNonClusteredItem(item)
        }
      }
    }

    this.#_previousClusters = newClusters
    this.#_previousHeight = currentHeight
  }

  get enabled() {
    return this.#_enabled
  }

  set enabled(value: boolean) {
    this.#_enabledDirty = value !== this.#_enabled
    this.#_enabled = value
  }

  get pixelRange() {
    return this.#_pixelRange
  }

  set pixelRange(value: number) {
    this.#_clusterDirty = this.#_clusterDirty || value !== this.#_pixelRange
    this.#_pixelRange = value
  }

  get minimumClusterSize() {
    return this.#_minimumClusterSize
  }

  set minimumClusterSize(value: number) {
    this.#_clusterDirty =
      this.#_clusterDirty || value !== this.#_minimumClusterSize
    this.#_minimumClusterSize = value
  }

  get clusterEvent() {
    return this.#_clusterEvent
  }

  get clusterBillboards() {
    return this.#_clusterBillboards
  }

  set clusterBillboards(value: boolean) {
    this.#_clusterDirty =
      this.#_clusterDirty || value !== this.#_clusterBillboards
    this.#_clusterBillboards = value
  }

  get clusterLabels() {
    return this.#_clusterLabels
  }

  set clusterLabels(value: boolean) {
    this.#_clusterDirty = this.#_clusterDirty || value !== this.#_clusterLabels
    this.#_clusterLabels = value
  }

  get clusterPoints() {
    return this.#_clusterPoints
  }

  set clusterPoints(value: boolean) {
    this.#_clusterDirty = this.#_clusterDirty || value !== this.#_clusterPoints
    this.#_clusterPoints = value
  }

  get labelCollection() {
    return this.#_labelCollection!
  }

  set labelCollection(c: LabelCollection) {
    this.#_clusterDirty = this.#_clusterDirty || c !== this.#_labelCollection
    this.#_labelCollection = c
  }

  get billboardCollection() {
    return this.#_billboardCollection!
  }

  set billboardCollection(c: BillboardCollection) {
    this.#_clusterDirty =
      this.#_clusterDirty || c !== this.#_billboardCollection
    this.#_billboardCollection = c
  }

  get pointCollection() {
    return this.#_pointCollection!
  }

  set pointCollection(c: PointPrimitiveCollection) {
    this.#_clusterDirty = this.#_clusterDirty || c !== this.#_pointCollection
    this.#_pointCollection = c
  }

  get #viewer() {
    return mapStoreTool.getMap()?.viewer
  }
}
