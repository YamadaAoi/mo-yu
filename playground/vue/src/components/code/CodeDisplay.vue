<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-11 16:11:22
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-20 16:48:11
 * @Description: 代码展示 
-->
<template>
  <div class="code-display">
    <div class="code-pick">
      <div class="code-select">
        <NSelect
          v-model:value="file"
          size="small"
          value-field="label"
          placeholder="请输入"
          :options="props.source ?? []"
          :consistent-menu-width="false"
        />
      </div>
      <div class="code-path">{{ path }}</div>
    </div>
    <div class="code-content">
      <pre><code class="hljs" v-html="code"></code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NSelect } from 'naive-ui'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

const props = defineProps<{
  source: Array<{
    label: string
    path: string
    raw: string
  }>
}>()
const file = ref(props.source?.[0]?.label ?? '')
const cur = computed(() => props.source.find(s => s.label === file.value))
const code = computed(() => {
  return cur.value ? hljs.highlightAuto(cur.value.raw).value : ''
})
const path = computed(() => {
  return cur.value ? cur.value.path : ''
})
</script>

<style scoped lang="scss">
.code-display {
  width: 100%;
  height: 100%;
  .code-pick {
    width: 100%;
    height: 70px;
    .code-select {
      width: 200px;
    }
    .code-path {
      margin: 10px;
      font-size: 14px;
      font-style: italic;
      color: #ccc;
    }
  }
  .code-content {
    width: 100%;
    height: calc(100% - 70px);
    font-size: 16px;
    @include scrollBase();
    .hljs {
      font-family: 'FiraCode';
    }
  }
}
</style>
