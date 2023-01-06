/*
 * @Author: zhouyinkui
 * @Date: 2023-01-06 16:49:14
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-06 17:04:20
 * @Description: popup通用方法
 * Copyright (c) 2023 by piesat, All Rights Reserved.
 */
/**
 * 弹框父节点id
 */
export const popupContainerId = 'MO-YU-POPUP-CONTAINER'
/**
 * 初始化弹框渲染父节点
 */
export function initPopupContainer() {
  let ele = document.getElementById(popupContainerId)
  if (!ele) {
    ele = document.createElement('div')
    ele.id = popupContainerId
    ele.style.position = 'absolute'
    ele.style.zIndex = '9999'
    ele.style.width = '0'
    ele.style.height = '0'
    ele.style.top = '0'
    ele.style.left = '0'
    document.body.appendChild(ele)
  }
}
