/*
 * @Author: zhouyinkui
 * @Date: 2023-01-11 17:30:34
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-11 17:55:35
 * @Description:
 * Copyright (c) 2023 by piesat, All Rights Reserved.
 */
import './highlight.scss'
import { defineComponent, h, computed } from 'vue'

/**
 * 高亮搜索关键字
 * @example
 * ```html
 * <m-highlight text="test" word="t"></m-highlight>
 * ```
 */
export default defineComponent({
  name: 'MHighlight',
  props: {
    text: {
      type: String,
      required: true
    },
    word: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup(props) {
    const keyword = computed(() => {
      return handleKeyword(props.word)
    })

    /**
     * 把匹配到的特殊字符 替换成 转义符+原来的字符
     * @param keyword - 关键字
     * @returns
     */
    function handleKeyword(keyword: string) {
      const origin = keyword ? `${keyword}` : ''
      let str = origin
      if (/(\+|-|&|\||!|\(|\)|\{|\}|\[|\]|\^|”|~|\*|\?|:|\\)/g.test(origin)) {
        str = origin.replace(
          /(\+|-|&|\||!|\(|\)|\{|\}|\[|\]|\^|”|~|\*|\?|:|\\)/g,
          `\\${
            origin.match(
              /(\+|-|&|\||!|\(|\)|\{|\}|\[|\]|\^|”|~|\*|\?|:|\\)/g
            )?.[0]
          }`
        )
      }
      return str
    }

    return {
      keyword
    }
  },
  render() {
    return this.text && this.keyword
      ? this.text
          .split(new RegExp(`(?<=${this.keyword})|(?=${this.keyword})`, 'i'))
          .map((str: string) => {
            if (str.toLowerCase() === this.word?.toLowerCase()) {
              return <mark class="m-highlight">{str}</mark>
            } else {
              return str
            }
          })
      : this.text ?? ''
  }
})
