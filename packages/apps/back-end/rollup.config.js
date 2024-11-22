const babel = require("@rollup/plugin-babel")

module.exports = {
    input: "./src/index.js",
    output: {
        file: "./dist/bundle.js",
        format: "umd",
        name: 'zqServer'
    },

    treeshake: false,

    plugin: [
        babel({
            runtimeHelpers: true,
            extensions: ['.js', '.ts'],
            exclude: "node_modules/**",
            externalHelpers: true,
        })
    ]
}