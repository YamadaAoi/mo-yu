<!--
 * @Author: zhouyinkui
 * @Date: 2023-01-11 16:11:22
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-06 15:46:18
 * @Description: 代码展示 
-->
<template>
  <div class="code-display">
    <pre><code class="hljs" v-html="code"></code></pre>
  </div>
</template>

<script setup lang="ts">
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

const props = defineProps<{
  source: string
}>()
const code = hljs.highlightAuto(props.source).value
</script>

<style scoped lang="scss">
.code-display {
  width: 100%;
  height: 100%;
  font-size: 16px;
  @include scrollBase();
  .hljs {
    font-family: 'FiraCode';
  }
}
</style>
