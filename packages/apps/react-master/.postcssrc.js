const { groups } = require('./colorCard')
module.exports = {
    "plugins": [
        require("autoprefixer"),
        require("tailwindcss"),
        require('postcss-nested'),
        require('postcss-nesting'),
        // require('./themePlugin')({ groups })
    ]
}