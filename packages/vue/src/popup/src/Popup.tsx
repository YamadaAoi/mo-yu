/*
 * @Author: zhouyinkui
 * @Date: 2023-01-05 18:10:46
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-06 15:59:12
 * @Description: 拖拽弹框
 * Copyright (c) 2023 by piesat, All Rights Reserved.
 */
import { defineComponent, ref, h } from 'vue'
import { DragTool } from '@mo-yu/core'

/**
 * 可拖拽弹框组件，相对于整个可视窗口拖动
 */
export default defineComponent({
  name: 'Popup',
  setup() {
    const a = ref(1)
    const drag = new DragTool({
      handleId: 'test-p'
    })

    return { a, drag }
  },
  render() {
    return <div id="test-p">{this.a}</div>
  }
})
