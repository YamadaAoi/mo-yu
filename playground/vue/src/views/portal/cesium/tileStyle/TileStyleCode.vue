<!--
 * @Author: zhouyinkui
 * @Date: 2024-02-04 10:16:16
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-09-18 15:46:44
 * @Description: shp生成的白膜图层根据属性设置样式
-->
<template>
  <div class="tile-style">
    <CommonMap @loaded="onLoaded" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { MapTileTool } from '@mo-yu/cesium'
import CommonMap from '../map/CommonMap.vue'

const mapReady = ref(false)
let tool: MapTileTool

onBeforeUnmount(() => {
  tool?.destroy()
})

function onLoaded() {
  mapReady.value = true
  tool = new MapTileTool({})
  tool.enable()
  tool.eventBus.on('pick-tile', e => {
    console.log(e.properties)
  })
  tool.add3DTileset({
    url: 'http://121.40.254.67:8001/tiles/gtsd/tileset.json',
    id: 'gtsd',
    style: {
      paramName: 'DLBM',
      colorList: [
        {
          label: '水浇地',
          value: '0102',
          color: 'rgba(252, 234, 158, 1)'
        },
        {
          label: '旱地',
          value: '0103',
          color: 'rgba(255, 251, 177, 1)'
        },
        {
          label: '果园',
          value: '0201',
          color: 'rgba(214, 167, 201, 1)'
        },
        {
          label: '茶园',
          value: '0202',
          color: 'rgba(213, 167, 176, 1)'
        },
        {
          label: '其他园地',
          value: '0204',
          color: 'rgba(231, 204, 226, 1)'
        },
        {
          label: '乔木林地',
          value: '0301',
          color: 'rgba(49, 173, 105, 1)'
        },
        {
          label: '竹林地',
          value: '0302',
          color: 'rgba(49, 173, 50, 1)'
        },
        {
          label: '其他林地',
          value: '0307',
          color: 'rgba(151, 207, 178, 1)'
        },
        {
          label: '其他草地',
          value: '0404',
          color: 'rgba(200, 227, 160, 1)'
        },
        {
          label: '物流仓储用地',
          value: '0508',
          color: 'rgba(197, 154, 145, 1)'
        },
        {
          label: '商业服务业设施用地',
          value: '05H1',
          color: 'rgba(226, 141, 229, 1)'
        },
        {
          label: '工业用地',
          value: '0601',
          color: 'rgba(197, 154, 140, 1)'
        },
        {
          label: '采矿用地',
          value: '0602',
          color: 'rgba(197, 154, 140, 1)'
        },
        {
          label: '城镇住宅用地',
          value: '0701',
          color: 'rgba(229, 103, 102, 1)'
        },
        {
          label: '农村宅基地',
          value: '0702',
          color: 'rgba(236, 137, 138, 1)'
        },
        {
          label: '公用设施用地',
          value: '0809',
          color: 'rgba(241, 165, 180, 1)'
        },
        {
          label: '广场用地',
          value: '0810A',
          color: 'rgba(255, 163, 214, 1)'
        },
        {
          label: '机关团体新闻出版用地',
          value: '08H1',
          color: 'rgba(241, 165, 180, 1)'
        },
        {
          label: '科教文卫用地',
          value: '08H2',
          color: 'rgba(241, 165, 180, 1)'
        },
        {
          label: '特殊用地',
          value: '09',
          color: 'rgba(193, 114, 97, 1)'
        },
        {
          label: '铁路用地',
          value: '1001',
          color: 'rgba(209, 201, 211, 1)'
        },
        {
          label: '公路用地',
          value: '1003',
          color: 'rgba(210, 216, 201, 1)'
        },
        {
          label: '城镇村道路用地',
          value: '1004',
          color: 'rgba(222, 222, 221, 1)'
        },
        {
          label: '交通服务场站用地',
          value: '1005',
          color: 'rgba(170, 169, 169, 1)'
        },
        {
          label: '农村道路',
          value: '1006',
          color: 'rgba(194, 193, 193, 1)'
        },
        {
          label: '河流水面',
          value: '1101',
          color: 'rgba(163, 214, 255, 1)'
        },
        {
          label: '水库水面',
          value: '1103',
          color: 'rgba(163, 214, 245, 1)'
        },
        {
          label: '坑塘水面',
          value: '1104',
          color: 'rgba(144, 170, 207, 1)'
        },
        {
          label: '养殖坑塘',
          value: '1104A',
          color: 'rgba(69, 107, 161, 1)'
        },
        {
          label: '沟渠',
          value: '1107',
          color: 'rgba(160, 205, 240, 1)'
        },
        {
          label: '水工建筑用地',
          value: '1109',
          color: 'rgba(230, 130, 100, 1)'
        },
        {
          label: '设施农用地',
          value: '1202',
          color: 'rgba(220, 180, 130, 1)'
        },
        {
          label: '裸岩石砾地',
          value: '1207',
          color: 'rgba(222, 221, 214, 1)'
        }
      ]
    }
  })
}
</script>

<style scoped lang="scss">
.tile-style {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
