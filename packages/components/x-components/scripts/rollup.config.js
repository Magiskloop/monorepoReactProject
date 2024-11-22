const clear = require('rollup-plugin-clear')
const autoAdd = require('rollup-plugin-auto-add').default
const multiInput = require('rollup-plugin-multi-input').default
const typescript = require('rollup-plugin-typescript2')
const path = require('path')
const peerDepExternal = require('rollup-plugin-peer-deps-external')
const resolve = require('@rollup/plugin-node-resolve')
const alias = require('@rollup/plugin-alias')
const commonjs = require('@rollup/plugin-commonjs')
const postcss = require('rollup-plugin-postcss')
const { terser } = require('rollup-plugin-terser')

const pkg = require('../package.json')

module.exports = [
    {
        input: 'src/index.tsx',
        output: [{
            dir: 'dist',
            format: 'ums',
            exports:'named',
            name:'pkg.name',
            scourceMap: true,
        }],
        external:Object.keys[pkg.peerDependencies || []],
        plugin: [
            clear({ target: 'esm' }), //自动清除生成代码
            // 代码自动注入
            autoAdd({
                include: [/src\/(((?!\/).)+?)\index\.tsx/gi]
            }),
            // 多入口
            multiInput(),
            //
            typescript({
                path: path.resolve(__dirname, './tsconfig.umd.json')
            }),
            peerDepExternal(),
            resolve(),
            commonjs(),
            postcss({
                minimize: true,
                sourceMap: true,
                extensions: ['.less', '.css'],
                use: [['less']]
            }),
            // 文件声明
            alias({
                extires: {
                    "@": path.resolve(__dirname, "../src")
                }
            })
        ]
    },
    {
        input: 'src/**/*',
        output: [{
            dir: 'esm',
            format: 'esm',
            scourceMap: true,
        }],
        plugin: [
            clear({ target: 'esm' }), //自动清除生成代码
            // 代码自动注入
            autoAdd({
                include: [/src\/(((?!\/).)+?)\index\.tsx/gi]
            }),
            // 多入口
            multiInput(),
            //
            typescript({
                path: path.resolve(__dirname, './tsconfig.esm.json')
            }),
            peerDepExternal(),
            resolve(),
            commonjs(),
            postcss({
                minimize: true,
                sourceMap: true,
                extensions: ['.less', '.css'],
                use: [['less']]
            }),
            // 文件声明
            alias({
                extires: {
                    "@": path.resolve(__dirname, "../src")
                }
            })
        ]
    },
]