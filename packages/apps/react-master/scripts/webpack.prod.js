const { merge } = require("webpack-merge")
const baseCfg = require("./webpack.base")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const ZipPlugin = require("../zipPlugin")

module.exports = merge(baseCfg(false), {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(), // 压缩css
            // 压缩js
            new TerserPlugin(
                // 多线程并行压缩
                {
                    parallel: true,
                    terserOptions: {
                        compress: {
                            // 把consle.log干掉
                            pure_funcs: ['console.log', 'console.warn']
                        }
                    }
                }
            )
        ],
        // 代码动态分包 ：
        // 一个项目如果所有东西都在一起，把公共的给拆出来，但是以什么样的规则来拆呢？
        splitChunks: {
            cacheGroups: {
                vendors: {
                    name: 'vendors',
                    test: /node_modules/,
                    // miniChunk: 3 —— 使用3次以上，才提取成公共的
                    // Chunks initail —— 只提取初始化的，不关心异步的，async —— 异步拆分，all —— 所有类型都拆分
                    // miniSize —— 最小多大的文件，我才提取
                },
                commons: {
                    name: 'commons'
                }
            },

        }
    },
    plugins: [
        new ZipPlugin({ filename: 'my.zip' })
    ]
})