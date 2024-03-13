<!--
 * @Author: zhouyinkui
 * @Date: 2024-03-13 16:03:44
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-13 16:22:19
 * @Description: 简易滚动
-->
<template>
  <div class="scroll-wrap">
    <MScroll :interval="100">
      <div class="article">
        {{ val }}
      </div>
    </MScroll>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MScroll } from '@mo-yu/vue'

const val = ref(
  `明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。转朱阁，低绮户，照无眠。不应有恨，何事长向别时圆？人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。`
)
</script>

<style scoped lang="scss">
.scroll-wrap {
  width: 300px;
  height: 60px;
  padding: 4px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  .article {
    text-indent: 2em;
  }
}
</style>
