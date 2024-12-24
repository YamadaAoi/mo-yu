/*
 * @Author: zhouyinkui
 * @Date: 2024-12-24 09:42:43
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-12-24 21:10:35
 * @Description:
 */
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import esbuild from 'rollup-plugin-esbuild'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const extensions = ['.mjs', '.js', '.json', '.ts']

export default defineConfig([
  {
    input: path.resolve(__dirname, '../src/index.ts'),
    output: {
      dir: 'es',
      format: 'es',
      entryFileNames: '[name].mjs',
      exports: 'named',
      preserveModules: true,
      preserveModulesRoot: 'src',
      sourcemap: false
    },
    plugins: [
      commonjs(),
      resolve({
        extensions
      }),
      json(),
      typescript({
        compilerOptions: {
          outDir: 'es',
          declaration: true,
          emitDeclarationOnly: true,
          declarationDir: 'es/types',
          sourceMap: false
        },
        include: ['src/index.ts']
      }),
      esbuild({
        tsconfig: path.resolve(__dirname, '../tsconfig.json'),
        target: 'esnext',
        minify: true
      })
    ]
  }
])
