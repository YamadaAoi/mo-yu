<!--
 * @Author: zhouyinkui
 * @Date: 2023-12-18 13:32:53
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-03 11:03:08
 * @Description: 
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
import { onMounted, onBeforeUnmount, ref } from 'vue'
import 'cesiumcss'
import { createWorldTerrain } from 'cesium'
import { MapView } from '@mo-yu/cesium'
import { useRem } from '@mo-yu/vue'

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
const { zoom } = useRem()

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

onBeforeUnmount(() => {
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
