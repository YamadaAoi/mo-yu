<!--
 * @Author: zhouyinkui
 * @Date: 2023-12-18 13:32:53
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-12-18 14:42:33
 * @Description: 
-->
<template>
  <div class="common-map">
    <div :id="props.mapId" class="cesium-container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import 'cesiumcss'
import { createWorldTerrain } from 'cesium'
import { MapView } from '@mo-yu/cesium'

const props = withDefaults(
  defineProps<{
    mapId?: string
  }>(),
  {
    mapId: 'mainMapView'
  }
)
const mapReady = ref(false)
const emits = defineEmits<{
  (e: 'loaded', id: string): void
  (e: 'removed'): void
}>()

let map: MapView

onMounted(() => {
  map = new MapView(props.mapId, {
    id: props.mapId
  })
  map.enable()
  map.eventBus.once('ready', e => {
    mapReady.value = true
    emits('loaded', e.view?.id)
    map.viewer.terrainProvider = createWorldTerrain()
  })
})

onUnmounted(() => {
  map?.destroy()
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
