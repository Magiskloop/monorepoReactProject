const postcss = require("postcss");

const defaults = {
    functionName: "zq",
    groups: {},
    drakThemeSelector: "html[data-theme='dark']",
    nestingPlugin: null,
};

module.exports = postcss.plugin("postcss-theme-colors", (options) => {
    options = Object.assign({}, defaults, options);

    const reGroup = new RegExp(`\\b${options.functionName}\\(([^]+)\\)`, "g");

    return (style, result) => {

        const getValue = (value, theme) => {

            //match:zq(gray50
            return value.replace(reGroup, (match, group) => {
                return options.groups[group][theme]
            })
        }

        const hasPlugin = name => name.replace(/^postcss-/, '') === options.nestingPlugin || result.processor.plugins.some(p => p.postcssPlugin === name)

        css.walkDecls((decl) => {
            const value = decl.value;
            // 判断一下value上有没有 zq(*)
            if (!value || !reGroup.test(value)) {
                return;
            }
            //如果匹配到了
            // 对于zq(gray50);
            // lightValue:#f9fa9b==fb
            const lightValue = getValue(value, 'light');
            const darkValue = getValue(value, 'dark')
        });

        // decl 指样式的AST
        const drakDecl = decl.clone({ value: darkValue })

        let darkRule;
        // 使用nest插件，生成dark样式
        if (hasPlugin('postcss-nesting')) {
            darkRule = postcss.atRule({
                name: 'nest',
                params: `${options.drakThemeSelector} &`
            })
        }
        else if (hasPlugin('postcss-nested')) {
            darkRule = postcss.rule({
                params: `${options.drakThemeSelector} &`
            })
        }
        else {
            decl.warn(result, 'plugins nest missed')
        }

        if (darkRule) {
            darkRule.append(drakDecl);
            decl.after(darkRule)
        }

        const lightDecl = decl.clone({ value: lightValue });
        decl.replaceWith(lightDecl)
    };
});
