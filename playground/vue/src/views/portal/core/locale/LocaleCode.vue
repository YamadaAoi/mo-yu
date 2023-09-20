<!--
 * @Author: zhouyinkui
 * @Date: 2023-09-20 11:22:34
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-20 15:47:21
 * @Description: 国际化工具代码示例
-->
<template>
  <NButton size="small" @click="toggleLang">切换语言环境</NButton>
  <div class="locale-label">当前语言环境：{{ desc1 }}</div>
  <div class="locale-label">当前语言环境：{{ desc2 }}</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NButton } from 'naive-ui'
import { LocaleTool } from '@mo-yu/core'
import { LocaleConfig } from './config/en_us'

type LocaleType = 'zh_cn' | 'en_us'
const lang = ref('')
const desc1 = ref<string>()
const desc2 = ref<string>()

const locale = new LocaleTool<LocaleType, LocaleConfig>({
  source: [
    {
      language: 'zh_cn',
      generate: () => import('./config/zh_cn')
    },
    {
      language: 'en_us',
      generate: () => import('./config/en_us')
    }
  ]
})
locale.eventBus.on('language-change', e => {
  lang.value = e.language
  desc1.value = locale.current?.common.language
  desc2.value = locale.i18n('common.language')
})
locale.changeLanguage('zh_cn')

function toggleLang() {
  locale.changeLanguage(lang.value === 'zh_cn' ? 'en_us' : 'zh_cn')
}
</script>

<style scoped lang="scss">
.locale-label {
  font-size: 16px;
  margin-top: 16px;
}
</style>
