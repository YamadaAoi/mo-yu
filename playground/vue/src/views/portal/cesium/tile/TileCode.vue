<!--
 * @Author: zhouyinkui
 * @Date: 2023-12-18 13:34:26
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-09-18 15:46:27
 * @Description: 普通模型3DTiles位置、缩放、角度配置，鼠标左键拖动水平位置，右键拖动竖直高度
-->
<template>
  <div class="tile-config">
    <CommonMap @loaded="onLoaded" />
    <template v-if="mapReady">
      <div class="edit-panel">
        <div class="edit-tools">
          <div class="edit-tool" @click="beforeAdd">添加</div>
          <label for="tile-import" class="edit-tool">
            <input id="tile-import" type="file" @change="importTiles" />
            导入
          </label>
          <div class="edit-tool" @click="exportTiles">导出</div>
        </div>
        <div class="edit-items">
          <div v-for="(item, i) in tiles" :key="i" class="edit-item">
            <div class="edit-options">
              <div
                :class="[
                  'edit-title',
                  curConfigId === item.id ? 'edit-chosen' : ''
                ]"
              >
                <span class="edit-label" :title="item.name">{{
                  item.name
                }}</span>
              </div>
              <div class="config-option">
                <div
                  :class="[
                    'option-btn',
                    curConfigId === item.id ? 'option-active' : ''
                  ]"
                  @click="editTile(item)"
                >
                  编辑
                </div>
                <div class="option-btn" @click="toggleTile(item)">
                  {{ hideTiles.includes(item.id) ? '显示' : '隐藏' }}
                </div>
                <div class="option-btn" @click="deleteTile(item.id)">删除</div>
              </div>
            </div>
            <div v-if="curConfigId === item.id" class="item-edit">
              <div class="form-row">
                <div class="form-label">
                  <span>名</span>
                  <span>称：</span>
                </div>
                <div class="form-input">
                  <NInput
                    :value="item.name"
                    size="small"
                    @update:value="
                      val => {
                        tileChange(val, 'name', item.id, true)
                      }
                    "
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-label">
                  <span>经</span>
                  <span>度：</span>
                </div>
                <div class="form-input">
                  <NInputNumber
                    :value="item.lng"
                    :show-button="false"
                    size="small"
                    @update:value="
                      val => {
                        tileChange(val, 'lng', item.id)
                      }
                    "
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-label">
                  <span>纬</span>
                  <span>度：</span>
                </div>
                <div class="form-input">
                  <NInputNumber
                    :value="item.lat"
                    :show-button="false"
                    size="small"
                    @update:value="
                      val => {
                        tileChange(val, 'lat', item.id)
                      }
                    "
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-label">
                  <span>高</span>
                  <span>度：</span>
                </div>
                <div class="form-input">
                  <NInputNumber
                    :value="item.height"
                    :show-button="false"
                    size="small"
                    @update:value="
                      val => {
                        tileChange(val, 'height', item.id)
                      }
                    "
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-label">
                  <span>缩</span>
                  <span>放：</span>
                </div>
                <div class="form-input">
                  <NInputNumber
                    :value="item.scale"
                    :show-button="false"
                    size="small"
                    @update:value="
                      val => {
                        tileChange(val, 'scale', item.id)
                      }
                    "
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-label">
                  <span>偏</span>
                  <span>航</span>
                  <span>角：</span>
                </div>
                <div class="form-input">
                  <NSlider
                    :style="{ zoom: 1 / zoom }"
                    :value="item.heading"
                    :tooltip="false"
                    :max="360"
                    @update:value="
                      val => {
                        tileChange(val, 'heading', item.id)
                      }
                    "
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-label">
                  <span>俯</span>
                  <span>仰</span>
                  <span>角：</span>
                </div>
                <div class="form-input">
                  <NSlider
                    :style="{ zoom: 1 / zoom }"
                    :value="item.pitch"
                    :tooltip="false"
                    :max="360"
                    @update:value="
                      val => {
                        tileChange(val, 'pitch', item.id)
                      }
                    "
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-label">
                  <span>翻</span>
                  <span>滚</span>
                  <span>角：</span>
                </div>
                <div class="form-input">
                  <NSlider
                    :style="{ zoom: 1 / zoom }"
                    :value="item.roll"
                    :tooltip="false"
                    :max="360"
                    @update:value="
                      val => {
                        tileChange(val, 'roll', item.id)
                      }
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
  <MPopup
    :mask="true"
    :visiable="visiable"
    title="添加3DTiles"
    class="tiles-pop"
    @close="cancel"
  >
    <div class="tiles-content">
      <div class="pop-row">
        <div class="pop-label need-field">3DTiles 名称：</div>
        <div class="pop-form">
          <NInput v-model:value="addParam.name" size="small" />
        </div>
      </div>
      <div class="pop-row">
        <div class="pop-label need-field">3DTiles 路径：</div>
        <div class="pop-form">
          <NInput v-model:value="addParam.url" size="small" />
        </div>
      </div>
      <div class="pop-btns">
        <div class="btn-confirm" @click="confirm">确定</div>
        <div class="btn-cancel" @click="cancel">取消</div>
      </div>
    </div>
  </MPopup>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { NInput, NInputNumber, NSlider, useMessage } from 'naive-ui'
import { isNumber, guid, readText, saveAsJson } from '@mo-yu/core'
import { useRem, MPopup } from '@mo-yu/vue'
import { Position, TileOption, MapTileConfigTool } from '@mo-yu/cesium'
import CommonMap from '../map/CommonMap.vue'

interface TileInfo extends TileOption {
  id: string
  url: string
  name: string
}

const { zoom } = useRem()
const message = useMessage()
const mapReady = ref(false)
const visiable = ref(false)
const readyForAdd = ref(false)
const addParam: Omit<TileInfo, 'id'> = reactive({
  name: '',
  url: ''
})
const tiles = ref<TileInfo[]>([
  {
    id: '5a685fb6-2aa8-477c-a715-efcf3f39a862',
    url: 'http://117.72.94.210:8001/tiles/qxz/tileset.json',
    name: '气象站',
    lng: 119.64264079934783,
    lat: 35.64920129045164,
    height: 100.2446526692178,
    scale: 3
  }
])
const curConfigId = ref('')
const hideTiles = ref<string[]>([])
let tool: MapTileConfigTool | undefined

function onLoaded() {
  mapReady.value = true
  tool = new MapTileConfigTool({ mapId: 'mainMapView' })
  tool.enable()
  tool.eventBus.on('position-change', e => {
    modelPositionChange(e.id, e.position)
  })
  tool.eventBus.on('tile-pick', e => {
    if (e.id) {
      tool?.locateTile(e.id)
      curConfigId.value = e.id
    }
  })
  tool.eventBus.on('position-pick', e => {
    if (e.position && readyForAdd.value) {
      addParam.lng = e.position.lng
      addParam.lat = e.position.lat
      addParam.height = e.position.height
      readyForAdd.value = false
      visiable.value = true
    }
  })
  loadTiles(tiles.value)
}

function importTiles(e: any) {
  if (e?.target?.files?.length) {
    readText(e.target.files[0])
      .then(text => {
        if (text) {
          const data = JSON.parse(text)
          if (data?.length) {
            tool?.clear()
            loadTiles(data)
            tiles.value = data
          }
        }
      })
      .catch(err => {
        message.error('导入飞行数据失败！')
        console.error(`导入飞行数据失败！${err}`)
      })
  }
}

function confirm() {
  if (addParam.url && addParam.name) {
    const t: TileInfo[] = [
      {
        id: guid(),
        url: addParam.url,
        name: addParam.name,
        lng: addParam.lng,
        lat: addParam.lat,
        height: addParam.height
      }
    ]
    loadTiles(t)
    tiles.value = tiles.value.concat(t)
    cancel()
  } else {
    message.error('请输入切片信息！')
  }
}

function exportTiles() {
  if (tiles.value.length) {
    saveAsJson(tiles.value)
  }
}

function editTile(tile: TileInfo) {
  if (tile.id === curConfigId.value) {
    curConfigId.value = ''
  } else {
    curConfigId.value = tile.id
    tool?.locateTile(tile.id)
  }
}

function toggleTile(tile: TileInfo) {
  if (hideTiles.value.includes(tile.id)) {
    hideTiles.value = hideTiles.value.filter(m => m !== tile.id)
    tool?.toggleTile(tile.id, true)
  } else {
    hideTiles.value = hideTiles.value.concat(tile.id)
    tool?.toggleTile(tile.id, false)
  }
}

function deleteTile(id: string) {
  tiles.value = tiles.value.filter(item => item.id !== id)
  tool?.deleteTile(id)
  if (id === curConfigId.value) {
    curConfigId.value = ''
  }
}

function tileChange(val: any, key: string, id: string, silent?: boolean) {
  tiles.value = tiles.value.map((m: TileInfo) => {
    if (id === m.id) {
      const newTile: TileInfo = { ...m, [key]: val }
      if (!silent && isNumber(val)) {
        tool?.updateTile(id, key, newTile)
      }
      return newTile
    } else {
      return m
    }
  })
}

function modelPositionChange(id: string, position: Required<Position>) {
  tiles.value = tiles.value.map(m => {
    if (m.id === id) {
      return { ...m, ...position }
    } else {
      return m
    }
  })
}

function loadTiles(arr: TileInfo[]) {
  if (arr?.length) {
    arr.forEach(tile => {
      tool?.add3DTileset(tile)
    })
  }
}

function beforeAdd() {
  readyForAdd.value = true
  message.warning('请在地图上选点')
}

function cancel() {
  visiable.value = false
  addParam.name = ''
  addParam.url = ''
  addParam.lng = undefined
  addParam.lat = undefined
  addParam.height = undefined
}
</script>

<style scoped lang="scss">
.tile-config {
  width: 100%;
  height: 100%;
  position: relative;

  .edit-panel {
    width: 360px;
    height: 100%;
    padding: 12px;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 999;
    background: rgba(6, 30, 60, 0.8);
    border: 1px solid rgba(28, 73, 91, 1);
    box-shadow: 0 16px 30px 0 rgba(13, 42, 88, 0.69);
    border-radius: 4px;
    .edit-tools {
      width: 100%;
      height: 42px;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .edit-tool {
        flex-shrink: 0;
        margin-left: 16px;
        @include btnNegative();
        input[type='file'] {
          display: none;
        }
      }
    }
    .edit-items {
      width: 100%;
      height: calc(100% - 48px);
      @include scrollHiddenBase();
      .edit-item {
        width: 100%;
        margin-bottom: 6px;
        .edit-options {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .edit-title {
            width: 45%;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            .edit-label {
              font-size: 18px;
              font-family: Microsoft YaHei;
              color: #cffbff;
              @include textOver();
            }
          }
          .config-option {
            display: flex;
            align-items: center;
            justify-content: center;
            .option-btn {
              position: relative;
              white-space: nowrap;
              cursor: pointer;
              font-size: 16px;
              font-family: Microsoft YaHei;
              color: #00eaff;
              margin: 0 5px;
              display: flex;
              align-items: center;
              justify-content: center;
              &::after {
                content: '';
                width: 2px;
                height: 15px;
                background-color: rgba(0, 234, 255, 0.45);
                @include centerY();
                right: -6px;
              }
              &:last-of-type {
                &::after {
                  display: none;
                }
              }
              &:hover {
                color: #fff196;
              }
            }
            .option-active {
              color: #fff196;
            }
            .color-pick {
              width: 28px;
            }
            .color-value {
              @include textOver();
            }
          }
          .edit-chosen {
            .edit-label {
              color: #fff196;
            }
          }
        }
        .item-edit {
          padding: 8px;
          border-radius: 4px;
          background-color: rgba(6, 30, 60, 0.8);
          .form-row {
            width: 100%;
            margin-bottom: 14px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            .form-label {
              width: calc(100% - 206px);
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
              @include textOver();
              font-size: 16px;
              font-family: MicrosoftYaHei;
              color: #ecfdff;
            }
            .form-input {
              width: 206px;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.tiles-pop {
  border-radius: 20px 20px 20px 0;
  background: rgba(0, 0, 0, 0.6);
  .m-popup-header {
    width: 100%;
    font-weight: bold;
    color: white;
    background: rgba(6, 30, 60, 1);
    border-radius: 20px 20px 0 0;
    text-align: center;
    border: 0px;
  }

  .tiles-content {
    width: 100%;
    height: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    background: rgba(6, 30, 60, 0.6);
    @include scrollBase();
    .pop-row {
      width: 100%;
      .pop-label {
        font-size: 18px;
        color: #cffbff;
        .service-wiki {
          color: #00eaff;
        }
      }
      .need-field {
        position: relative;
        &::before {
          content: '*';
          color: red;
          font-size: 25x;
        }
      }
      .pop-form {
        width: 100%;
      }
    }
    .pop-btns {
      width: 100%;
      margin-top: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      .btn-confirm {
        margin: 0 4px;
        @include btnPositive();
      }
      .btn-cancel {
        margin: 0 4px;
        @include btnNegative();
      }
    }
  }
}
</style>
