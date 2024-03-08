<!--
 * @Author: zhouyinkui
 * @Date: 2024-01-08 14:20:32
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-08 14:40:06
 * @Description: 初始化一个简单的地图场景，包括底图，地形，遮罩
-->
<template>
  <div class="common-map">
    <div
      :id="props.mapId"
      :style="{ zoom: 1 / zoom }"
      class="cesium-container"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import 'cesiumcss'
import { initCesiumBaseUrl, MapView, SceneConfig } from '@mo-yu/cesium'
import { useRem } from '@mo-yu/vue'

initCesiumBaseUrl(import.meta.env.CESIUM_BASE_URL)

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
const { zoom } = useRem()

let map: MapView

onMounted(() => {
  loadConfig()
    .then(config => {
      map = new MapView(props.mapId, {
        id: props.mapId
      })
      map.enable()
      map.eventBus.once('ready', e => {
        map.sceneTool.prepareScene(config)
        emits('loaded', e.view?.id)
      })
    })
    .catch(err => {
      console.error(err)
    })
})

onBeforeUnmount(() => {
  map?.destroy()
  emits('removed')
})

async function loadConfig() {
  const res = await fetch(`/map/${props.mapId}.json`)
  const json: SceneConfig = await res.json()
  return json
}
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
