/*
 * @Author: zhouyinkui
 * @Date: 2023-12-18 13:40:05
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-12-18 13:40:08
 * @Description:
 */
import { download } from '../download'

/**
 * 下载json对象为json文件
 * @param data - json对象
 * @param fileName - 文件名
 */
export function saveAsJson(data: any, fileName = 'data.json') {
  const content = JSON.stringify(data)
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const objectURL = URL.createObjectURL(blob)
  download(objectURL, fileName)
  URL.revokeObjectURL(objectURL)
}
