/*
 * @Author: zhouyinkui
 * @Date: 2024-12-23 10:31:55
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-12-24 16:54:49
 * @Description:
 */
import path from 'path'
import { fileURLToPath } from 'url'
import { copy, mkdir, writeFile } from 'fs-extra'
import madge from 'madge'
import { ComponentInfo } from '../src/commands/util'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
/**
 * es目录
 */
const esDir = path.resolve(__dirname, '../es')
/**
 * es源码目录
 */
const compDir = path.resolve(esDir, 'components')
/**
 * 组件配置文件
 */
const compJson = path.resolve(esDir, 'components.json')
/**
 * 源码目录
 */
const sourceDir = path.resolve(__dirname, '../src/components')
/**
 * ts配置文件
 */
const tsJson = path.resolve(__dirname, '../tsconfig.json')

function getComponent(p: string, deps?: string[]) {
  let component: ComponentInfo | undefined
  if (p) {
    const arr = p.split('/')
    const fileName = arr[arr.length - 1]
    if (fileName.includes('.')) {
      const dependencies: string[] = []
      deps?.forEach(dp => {
        const c = getComponent(dp)
        if (c) {
          dependencies.push(c.name)
        }
      })
      component = {
        name: fileName.split('.')[0],
        path: arr.slice(0, arr.length - 1).join('/'),
        dependencies
      }
    }
  }
  return component
}

async function main() {
  const res = await madge(sourceDir, {
    fileExtensions: ['ts', 'tsx', 'js', 'jsx', 'vue'],
    tsConfig: tsJson
  })
  const obj = res.obj()
  console.log(obj)
  const arr: ComponentInfo[] = []
  Object.keys(obj).forEach(key => {
    const component = getComponent(key, obj[key])
    if (component) {
      arr.push(component)
    }
  })
  await mkdir(esDir, { recursive: true })
  await writeFile(compJson, JSON.stringify(arr, null, 2))
  await copy(sourceDir, compDir)
}

main().catch(e => {
  console.error(e)
})
