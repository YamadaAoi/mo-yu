<!--
 * @Author: zhouyinkui
 * @Date: 2024-01-08 14:20:32
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-12-04 10:13:34
 * @Description: 初始化一个简单的地图场景，包括底图，地形，遮罩
-->
<template>
  <div class="common-map">
    <div :id="props.mapId" class="cesium-container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import 'cesiumcss'
import { ScreenSpaceEventType } from 'cesium'
import { initCesiumBaseUrl, MapView, mapStoreTool } from '@mo-yu/cesium'

initCesiumBaseUrl('/cesium')

const props = withDefaults(
  defineProps<{
    mapId?: string
  }>(),
  {
    mapId: 'mainMapView'
  }
)
const emits = defineEmits<{
  (e: 'loaded', id: string): void
  (e: 'removed'): void
}>()

let map: MapView

onMounted(() => {
  map = new MapView(props.mapId, {
    id: props.mapId,
    sceneConfigPath: `/map/${props.mapId}.json`
  })
  map.enable()
  map.eventBus.once('ready', e => {
    map.sceneTool.enable()
    if (map.mapOptions.sceneConfig) {
      map.sceneTool.prepareScene(map.mapOptions.sceneConfig, 1.5)
    }
    map.viewer.screenSpaceEventHandler.setInputAction(() => {
      console.log(map.sceneTool.camera.getCameraParam())
    }, ScreenSpaceEventType.LEFT_CLICK)
    emits('loaded', e.view?.id)
  })
})

onBeforeUnmount(() => {
  mapStoreTool.deleteMap(props.mapId)
  emits('removed')
})
</script>

<style scoped lang="scss">
.common-map {
  width: 100%;
  height: 100%;
  position: relative;

  .cesium-container {
    width: 100%;
    height: 100%;
  }
}
</style>
