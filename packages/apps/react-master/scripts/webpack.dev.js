const { merge } = require('webpack-merge')
const baseCfg = require('./webpack.base')
const path = require("path")

module.exports = merge(baseCfg(true), {
    // 开发环境
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        port: 3000,
        compress: false, // 不压缩，热更新，更快
        hot: true, // 热更新
        historyApiFallback: true, // 开发环境下，history路由的404问题
        static: {
            // 托管静态资源public 文件夹
            directory: path.join(__dirname, '../public')
        }
    }
})