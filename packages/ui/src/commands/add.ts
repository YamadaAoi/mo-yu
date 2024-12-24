/*
 * @Author: zhouyinkui
 * @Date: 2024-12-23 14:56:49
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-12-24 17:40:56
 * @Description:
 */
import path from 'path'
import { fileURLToPath } from 'url'
import { Command } from 'commander'
import prompts from 'prompts'
import { z } from 'zod'
import { readJson, copy, pathExists } from 'fs-extra'
import { ComponentInfo, log } from './util'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compDir = path.resolve(__dirname, '../components')
const compJson = path.resolve(__dirname, '../components.json')
const addOptionsSchema = z.object({
  components: z.array(z.string()).optional(),
  overwrite: z.boolean(),
  cwd: z.string(),
  all: z.boolean(),
  path: z.string().optional()
})

/**
 * 获取所选组件及其依赖组件
 * @param names -
 * @param components -
 * @returns
 */
function getDependencies(names: string[], components: ComponentInfo[]) {
  const allDeps: ComponentInfo[] = []
  function getDeps(n: string) {
    const component = components.find(c => c.name === n)
    if (component) {
      allDeps.push(component)
      component.dependencies?.forEach(d => {
        getDeps(d)
      })
    }
  }
  names.forEach(n => {
    getDeps(n)
  })
  return allDeps.filter(
    (c, i, arr) => arr.findIndex(a => a.name === c.name) === i
  )
}

/**
 * 复制组件到目标路径
 * @param c -
 * @param dest -
 */
async function handleCopy(c: ComponentInfo, dest: string) {
  const source = path.resolve(compDir, c.path)
  await copy(source, dest)
  log.success(`已复制组件 [${c.name}] 到 "${dest}"`)
}

/**
 * 复制组件
 * 若overwrite未开启，则不覆盖已存在的组件
 * @param c -
 * @param options -
 */
async function copyComponent(
  c: ComponentInfo,
  options: z.infer<typeof addOptionsSchema>
) {
  const dest = path.resolve(
    options.cwd,
    options.path ?? 'src/components',
    c.path
  )
  if (!options.overwrite) {
    // 如果组件已存在，则不覆盖
    const exists = await pathExists(dest)
    if (exists) {
      log.warn(`组件 [${c.name}] 已存在！`)
    } else {
      await handleCopy(c, dest)
    }
  } else {
    await handleCopy(c, dest)
  }
}

/**
 * 复制选中的组件
 * @param options -
 */
async function copySelectedComponents(
  options: z.infer<typeof addOptionsSchema>
) {
  let allComponents: ComponentInfo[] = []
  const json: ComponentInfo[] = await readJson(compJson)
  if (Array.isArray(json) && json.length) {
    allComponents = getDependencies(options.components ?? [], json)
  }
  if (allComponents.length) {
    const promises = allComponents.map(c => copyComponent(c, options))
    await Promise.all(promises)
  }
}

/**
 * 复制所有组件
 * @param options -
 */
async function copyAllComponents(options: z.infer<typeof addOptionsSchema>) {
  const json: ComponentInfo[] = await readJson(compJson)
  if (Array.isArray(json) && json.length) {
    const promises = json.map(c => copyComponent(c, options))
    await Promise.all(promises)
  }
}

export const add = new Command()
  .name('add')
  .description('添加组件源码（vue3 + ts + scss）到您的项目中')
  .argument('[components...]', '需要添加的组件')
  .option('-c, --cwd <cwd>', '工作目录，默认当前位置', process.cwd())
  .option('-o, --overwrite', '覆盖已有的同名组件文件', false)
  .option('-a, --all', '添加库内所有组件到您的项目中', false)
  .option('-p, --path <path>', '组件存放路径，默认 src/components')
  .action(async (components, opts) => {
    const options = addOptionsSchema.parse({
      components,
      cwd: path.resolve(opts.cwd),
      ...opts
    })
    if (options.components?.length) {
      // 复制选中的组件
      await copySelectedComponents(options)
    } else if (options.all) {
      // 复制所有组件
      await copyAllComponents(options)
    } else {
      // 列出组件供选择
      const json: ComponentInfo[] = await readJson(compJson)
      if (Array.isArray(json) && json.length) {
        log.info('请选择需要添加的组件：')
        const { components } = await prompts({
          type: 'multiselect',
          name: 'components',
          message: '请选择需要添加的组件：',
          hint: '使用空格键选中，上下键切换，回车键确认',
          instructions: false,
          choices: json.map(c => ({
            title: c.name,
            value: c.name
          }))
        })
        if (components?.length) {
          options.components = components
          await copySelectedComponents(options)
        } else {
          log.error('未选择任何组件！退出 @mo-yu/ui 添加流程')
          process.exit(1)
        }
      }
    }
  })
