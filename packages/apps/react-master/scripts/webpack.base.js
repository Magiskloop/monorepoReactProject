const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = function (isDev) {
    return {
        // 1.输入输出部分
        // 最基础的，是入口
        entry: path.resolve(__dirname, "../src/index.tsx"),
        output: {
            // 打包输出的结果路径
            path: path.resolve(__dirname, "../dist"),
            // 每个输出的js名称
            // hash，contentHash，chunkHash 的区别？
            filename: "static/js/[name].[hash:8].js",
            // webpack5 内置，构建前删除dist
            // webpack4 没有此项功能，是clean-webpack-plugin
            clean: true,
            publicPath: '/'
        },
        // 2.resolve部分
        // 表示文件是如何优化搜索依赖的
        // 用于在引入模块时，可以不带文件后缀，本质也是一个优先级的顺序，可能会影响构建性能
        resolve: {
            extensions: ['.tsx', '.ts', '.jsx', '.js']
        },
        // 3.loader部分
        module: {
            // loader 是在入口文件，解析各种 import,from文件
            // 针对不同类型的文件，有不同的处理方法
            // 不同后缀的文件需要有一个解析器，去识别这些文件的内容的含义，从而保证最后形成一个bundle
            rules: [
                {
                    test: /\.(tsx|ts)$/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                // postcss-loader:帮助处理一些语法转换问题，因为我们要用tailwind
                // postcss，相当于 css 界的babel
                // css-loader：主要用于处理路径，<link>
                // style-loader：帮我们把css的属性，放进内联样式上
                // dev：css嵌套在style标签里，方便热替换
                // prod：我们希望使用mini-css-extract-plugin，帮我们单独抽离出来，方便文件缓存
                {
                    // 按顺序匹配，匹配是谁就是谁
                    oneOf: [
                        // css模块化方案：定一个规则，我们用xxx。module.(css | less) 这种格式来处理
                        {
                            test: /\.module\.(less|css)$/,
                            include: [path.resolve(__dirname, "../src")],
                            use: [
                                isDev ? "style-loader" : MiniCssExtractPlugin.loader,
                                {
                                    loader: 'css-loader',
                                    options: {
                                        modules: {
                                            // 这里借助css-module，实现BEM风格
                                            localIdentName: "[path][name]__[local]--[hash:base64:5]"
                                        }
                                    }
                                },
                                "postcss-loader",
                                "less-loader",
                            ]
                        },
                        {
                            test: /\.css$/,
                            use: [
                                isDev ? "style-loader" : MiniCssExtractPlugin.loader,
                                "css-loader",
                                "postcss-loader"
                            ]
                        },
                        {
                            test: /\.less$/,
                            include: [path.resolve(__dirname, "../src")],
                            use: [
                                isDev ? "style-loader" : MiniCssExtractPlugin.loader,
                                "css-loader",
                                "postcss-loader",
                                "less-loader"
                            ]
                        },
                    ]
                },

                {
                    // webpack5 之前，要用loader(url, file),去处理，现在都内置了
                    test: /\.(woff2?|eot|ttf|otf|)$/,
                    generator: {
                        filename: 'static/fonts/[name].[contenthash:8][ext]'
                    }
                },
                {
                    // webpack5 之前，要用loader(url, file),去处理，现在都内置了
                    test: /\.(png|jpg|jpeg|git|webp|svg)$/,
                    generator: {
                        filename: 'static/images/[name].[contenthash:8][ext]'
                    }
                },
                {
                    // webpack5 之前，要用loader(url, file),去处理，现在都内置了
                    test: /\.(mp4|flv|mp3|wav)$/,
                    generator: {
                        filename: 'static/media/[name].[contenthash:8][ext]'
                    }
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                // 这里就是把我们的js和css注入到html的模板里
                template: path.resolve(__dirname, "../public/index.html"),
                // 自动注入资源文件
                inject: true
            }),
            new MiniCssExtractPlugin({
                filename: isDev ? "static/css/[name].css" : "static/css/[name].[contenthash:4].css"
            })
        ]
    }
}