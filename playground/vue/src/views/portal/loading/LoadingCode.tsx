/*
 * @Author: zhouyinkui
 * @Date: 2023-01-11 16:38:40
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-11 16:59:28
 * @Description:
 * Copyright (c) 2023 by piesat, All Rights Reserved.
 */
import { defineComponent } from 'vue'
import CodeDisplay from '../../../components/code/CodeDisplay.vue'

export default defineComponent({
  name: 'LoadingCode',
  setup() {
    const code = `
  <!-- m-loading包裹在项目最外层 -->
  <m-loading>
    <Header></Header>
    <div class="app-body"><router-view /></div>
  </m-loading>

  <!-- 项目内部导入useLoading方法 -->
  <template>
    <demo-wrap>
      <template #demo>
        <n-button @click="doFetch">请求数据</n-button>
      </template>
      <template #code>
        <loading-code></loading-code>
      </template>
    </demo-wrap>
  </template>
  
  <script setup lang="ts">
  import { NButton, useMessage } from 'naive-ui'
  import { useLoading } from '@mo-yu/vue'
  import DemoWrap from '../../../components/demo/DemoWrap.vue'
  import LoadingCode from './LoadingCode'
  
  const { addLoading } = useLoading()
  const message = useMessage()
  
  function doFetch() {
    const remove = addLoading()
    fakeRequest()
      .then(() => {
        message.success('请求结束！')
        remove()
      })
      .catch(() => {
        message.error('请求失败！')
        remove()
      })
  }
  
  async function fakeRequest() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true)
      }, 3000)
    })
  }
  </script>
  `
    return {
      code
    }
  },
  render() {
    return <CodeDisplay source={this.code}></CodeDisplay>
  }
})
