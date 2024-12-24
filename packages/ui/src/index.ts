/*
 * @Author: zhouyinkui
 * @Date: 2024-12-23 14:30:26
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-12-24 16:35:05
 * @Description:
 */
import { Command } from 'commander'
import { add } from './commands/add'
import packageJson from '../package.json'

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

async function main() {
  const program = new Command()
    .name('@mo-yu/ui')
    .description('添加组件源码（vue3 + ts + scss）到您的项目中')
    .version(packageJson.version || '1.0.0', '-v, --version', '显式版本号')

  program.addCommand(add)

  program.parse()
}

main()
