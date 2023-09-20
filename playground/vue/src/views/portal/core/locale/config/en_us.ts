/*
 * @Author: zhouyinkui
 * @Date: 2023-09-20 15:06:28
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-20 15:42:58
 * @Description: 英文
 */
const en_us = {
  common: {
    confirm: 'confirm',
    cancel: 'cancel',
    language: 'English'
  },
  login: {
    userName: 'UserName',
    password: 'Password'
  }
}

type LocaleConfig = typeof en_us

export { LocaleConfig }

/**
 * 请导出模块默认成员
 */
export default en_us
