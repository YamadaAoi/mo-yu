/*
 * @Author: zhouyinkui
 * @Date: 2022-06-17 14:35:34
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2023-09-07 09:55:36
 * @Description:
 */
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import esbuild from 'rollup-plugin-esbuild'
import postcss from 'rollup-plugin-postcss'
import postcssPresetEnv from 'postcss-preset-env'
import cssnano from 'cssnano'
import cssnanoPresetAdvanced from 'cssnano-preset-advanced'
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
    output: {
      dir: path.dirname(pkg.module),
      format: 'es',
      exports: 'named',
      preserveModules: true,
      preserveModulesRoot: 'src',
      sourcemap: true
    },
    plugins: [
      commonjs(),
      resolve({
        extensions
      }),
      postcss({
        plugins: [
          postcssPresetEnv(),
          cssnano({
            preset: [
              cssnanoPresetAdvanced,
              {
                autoprefixer: false, // cssnano-preset-advanced和cssnano都具有autoprefixer
                zindex: false // z-index会被cssnano重新计算为1
              }
            ]
          })
        ]
      }),
      typescript({
        compilerOptions: {
          outDir: 'es',
          declaration: true,
          emitDeclarationOnly: true,
          declarationDir: 'es',
          sourceMap: true
        }
      }),
      esbuild({
        tsconfig: path.resolve(__dirname, '../tsconfig.json'),
        target: 'esnext',
        minify: true
      }),
      strip(),
      visualizer()
    ],
    external: ['vue', '@mo-yu/core']
  },
  {
    input: path.resolve(__dirname, '../src/index.ts'),
    output: [
      {
        dir: path.dirname(pkg.main),
        format: 'cjs',
        exports: 'named',
        preserveModules: true,
        preserveModulesRoot: 'src',
        sourcemap: true
      },
      {
        file: path.resolve(__dirname, '../dist/index.js'),
        format: 'umd',
        name: 'MoYuVue',
        exports: 'named',
        sourcemap: true,
        globals: {
          vue: 'Vue',
          '@mo-yu/core': 'MoYuCore'
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
        minify: true
      }),
      postcss({
        plugins: [
          cssnano({
            preset: [
              cssnanoPresetAdvanced,
              {
                autoprefixer: false,
                zindex: false
              }
            ]
          })
        ]
      }),
      strip()
    ],
    external: ['vue', '@mo-yu/core']
  }
])
