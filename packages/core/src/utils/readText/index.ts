/*
 * @Author: zhouyinkui
 * @Date: 2023-12-18 13:38:12
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-12-18 13:38:15
 * @Description:
 */
/**
 * 读取blob为纯文本
 * @param blob -
 * @returns
 */
export function readText(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      if (typeof e.target?.result === 'string') {
        resolve(e.target.result)
      } else {
        reject(new Error('parse Blob fail!'))
      }
    }
    reader.onerror = error => {
      reject(error)
    }
    reader.readAsText(blob)
  })
}
