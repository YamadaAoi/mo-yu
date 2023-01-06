/*
 * @Author: zhouyinkui
 * @Date: 2022-06-17 14:35:34
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-01-06 15:18:52
 * @Description:
 * Copyright (c) 2022 by piesat, All Rights Reserved.
 */
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import esbuild from 'rollup-plugin-esbuild'
import { visualizer } from 'rollup-plugin-visualizer'
import strip from '@rollup/plugin-strip'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const pkg = require('../package.json')
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const extensions = ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx']

export default defineConfig([
  {
    input: path.resolve(__dirname, '../src/index.ts'),
    output: [
      {
        dir: path.dirname(pkg.module),
        format: 'es',
        name: pkg.name,
        exports: 'named',
        preserveModules: true,
        preserveModulesRoot: 'src',
        sourcemap: true,
        plugins: [visualizer()]
      },
      {
        dir: path.dirname(pkg.main),
        format: 'cjs',
        name: pkg.name,
        exports: 'named',
        preserveModules: true,
        preserveModulesRoot: 'src',
        sourcemap: true
      },
      {
        file: path.resolve(__dirname, '../dist/index.js'),
        format: 'umd',
        name: pkg.name,
        exports: 'named',
        sourcemap: true,
        globals: {
          vue: 'Vue'
        }
      }
    ],
    plugins: [
      commonjs(),
      resolve({
        extensions
      }),
      esbuild({
        tsconfig: path.resolve(__dirname, '../tsconfig.json'),
        target: 'esnext',
        sourceMap: true
      }),
      strip()
    ],
    external: ['vue']
  },
  {
    input: path.resolve(__dirname, '../src/index.ts'),
    output: {
      dir: path.dirname(pkg.module),
      format: 'es',
      name: pkg.name,
      exports: 'named',
      preserveModules: true,
      preserveModulesRoot: 'src'
    },
    plugins: [
      commonjs(),
      resolve({
        extensions
      }),
      typescript({
        compilerOptions: {
          outDir: 'es',
          declaration: true,
          declarationDir: 'es',
          sourceMap: false
        }
      })
    ],
    external: ['vue']
  }
])
