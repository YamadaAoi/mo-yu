/*
 * @Author: zhouyinkui
 * @Date: 2022-08-10 16:47:07
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-12-11 14:51:24
 * @Description: naive-ui 主题样式
 * Copyright (c) 2022 by piesat, All Rights Reserved.
 */
import { GlobalThemeOverrides } from 'naive-ui'

export const customTheme: GlobalThemeOverrides = {
  common: {
    fontSize: '0.14rem',
    fontSizeMini: '0.14rem',
    fontSizeTiny: '0.14rem',
    fontSizeSmall: '0.16rem',
    fontSizeMedium: '0.16rem',
    fontSizeLarge: '0.18rem',
    fontSizeHuge: '0.18rem',
    scrollbarColor: 'rgba(255,255,255,0.35)',
    scrollbarColorHover: 'rgba(255,255,255,0.5)'
  },
  Input: {
    textColor: '#CFFBFF',
    placeholderColor: 'rgba(255,255,255,0.6)',
    color: 'rgba(0, 198, 255, 0.25)',
    colorFocus: 'rgba(0, 198, 255, 0.25)',
    caretColor: 'rgba(255,255,255,0.8)',
    border: '1px solid rgba(15, 133, 126, 0.48)',
    borderHover: '1px solid rgba(0, 234, 255, 0.48)',
    borderFocus: '1px solid rgba(0, 234, 255, 0.48)',
    suffixTextColor: '#ffffff',
    boxShadowFocus: '',
    heightSmall: '0.27rem',
    fontSizeSmall: '0.16rem'
  },
  Popover: {
    color: 'rgba(0,0,0,0)',
    padding: '0px'
  },
  Slider: {
    railHeight: '3px',
    handleSize: '9px',
    railColor: '#06325E',
    railColorHover: '#06325E',
    fillColor: '#59EDFF',
    fillColorHover: '#59EDFF',
    handleColor: '#59EDFF'
  },
  Popconfirm: {
    iconColor: '#ffffff',
    fontSize: '0.14rem',
    iconSize: '0.14rem'
  }
}
