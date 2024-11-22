

export const RequestMethod = {
    GET: 'get',
    POST: "post",
    PUT: 'put',
    DELETE: 'delete'
}

export const controllers = []; // 收集依赖

// 类装饰器能够获取target：原型 和 name：函数方法名

// 定义装饰器
export function Controller(prefix = '') {
    // 定义在构造函数上
    return function (target) {
        target.prefix = prefix
    }
}
export function RequestMapping(method = '', url = '') {

    return function (target, name) {
        let path = url || `/${name}`;

        const item = {
            path,
            method,
            handler: target[name], // 原型
            constructor: target.constructor
        }

        controllers.push(item)
    }
}