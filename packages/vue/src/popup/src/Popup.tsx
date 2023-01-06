/*
 * @Author: zhouyinkui
 * @Date: 2023-01-05 18:10:46
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-06 18:00:35
 * @Description: 拖拽弹框
 * Copyright (c) 2023 by piesat, All Rights Reserved.
 */
import './popup.scss'
import {
  defineComponent,
  ref,
  h,
  Teleport,
  PropType,
  StyleValue,
  watch,
  onMounted,
  onUnmounted,
  nextTick
} from 'vue'
import { DragTool, OriginPosition, guid } from '@mo-yu/core'
import { popupContainerId } from './util'

/**
 * 可拖拽弹框组件，相对于整个可视窗口拖动
 * 在项目入口先调用initPopupContainer()方法渲染popup父节点
 */
export default defineComponent({
  name: 'Popup',
  props: {
    visiable: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    style: {
      type: Object as PropType<StyleValue>,
      required: false
    },
    class: {
      type: String,
      required: false
    },
    position: {
      type: String as PropType<OriginPosition>,
      required: false
    },
    hideClose: {
      type: Boolean,
      required: false
    },
    zoom: {
      type: Number,
      required: false,
      default: 1
    }
  },
  emits: {
    close() {
      return true
    }
  },
  setup(props, { emit }) {
    const popupWinId = ref(`popupWin${guid()}`)
    const popupHeadId = ref(`popupHead${guid()}`)
    const drag = new DragTool({
      handleId: popupHeadId.value,
      targetId: popupWinId.value,
      zoom: props.zoom
    })

    watch(
      () => props.zoom,
      next => {
        drag?.resetZoom(next)
      },
      { immediate: true }
    )

    watch(
      () => props.visiable,
      next => {
        if (next) {
          dragEnable()
          locate(props.position)
        } else {
          drag.destroy()
        }
      },
      { immediate: true }
    )

    onMounted(() => {
      dragEnable()
    })

    onUnmounted(() => {
      drag.destroy()
    })

    function dragEnable() {
      nextTick()
        .then(() => {
          drag.enable()
        })
        .catch(err => {
          console.error(`popup启用失败！${err}`)
        })
    }

    function locate(posi?: OriginPosition) {
      nextTick()
        .then(() => {
          drag.locate(posi)
        })
        .catch(err => {
          console.error(`popup定位失败！${err}`)
        })
    }

    function close() {
      emit('close')
    }

    return { popupWinId, popupHeadId, close }
  },
  render() {
    return (
      <Teleport to={popupContainerId}>
        {this.visiable ? (
          <div
            id={this.popupWinId}
            class={`m-popup ${this.class ?? ''}`}
            style={this.style}>
            <div id={this.popupHeadId} class="m-popup-header">
              {this.title}
              {this.hideClose ? (
                ''
              ) : (
                <span class="m-popup-close" onClick={this.close}>
                  &#10006;
                </span>
              )}
            </div>
            <div class="m-popup-body">{this.$slots.default}</div>
          </div>
        ) : (
          ''
        )}
      </Teleport>
    )
  }
})
