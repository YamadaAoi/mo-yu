/*
 * @Author: zhouyinkui
 * @Date: 2022-06-17 14:35:34
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-12-24 21:14:13
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
      sourcemap: false
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
          sourceMap: false
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
    output: {
      dir: path.dirname(pkg.main),
      format: 'cjs',
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
  },
  {
    input: path.resolve(__dirname, '../src/index.ts'),
    output: {
      file: path.resolve(__dirname, '../dist/index.js'),
      format: 'umd',
      name: 'MoYuVue',
      exports: 'named',
      sourcemap: false,
      globals: {
        vue: 'Vue',
        '@mo-yu/core': 'MoYuCore'
      }
    },
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
