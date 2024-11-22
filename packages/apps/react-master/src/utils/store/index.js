/**
 * 本地存储工具 SDK
 * 1.可以在初始化的时候就决定，是要在本地存储，还是在其他地方存储，并且确定是
 * localStorage, sessionStorage
 * 所有的 api 都一样，只有初始化参数不一样
 * 2.如果是浏览的存储出现了异步的时序问题，高频线程问题，都可以结局
 * 3.如果本地缓存有问题，在处理数据的时候可以进行降级
 * 4.不用自己解析，存储支持数组方法等（可能还具备 加密、 解密、过期时间）
 *
 * 做一些过度设计，一个小工具怎么尽量做到极致，形成亮点丰富自己的简历
 */

// 是一个存储类
const CreateStore = function (
    unlocal = false,
    opts = {},
) {
    this.unlocal = unlocal
    this.maxLength = opts.maxLength || 30;
    this.expireTime = opts.expireTime || NaN
    this.plugins = opts.plugins
    this.observe()
};

// 组合寄生继承
// 基本方法， CreateStore的实例，就是__mock__storage的数据
CreateStore.prototype.set = function (type, data) {
    this.__mock__storage[`${this.bizcode}_${type}`] = data
}

CreateStore.prototype.get = function (type) {
    return this.__mock__storage[`${this.bizcode}_${type}`]
}

CreateStore.prototype.observe = function () {
    const context = this;
    this.__mock__storage = new Proxy({}, {
        get(target, property, receiver) {
            let result;
            //  选用本地存储，直接getItem
            if (!context.unlocal) {
                result = (Reflect.get(target, property, receiver || context.getItem?.(property)))
            } else {
                result = Reflect.get(target, property, receiver)
            }
            return result
        },
        set(target, property, value, receiver) {
            let _value = value;
            // 数据劫持
            if (value instanceof Array && value.length > context.maxLength) {
                _value = value.slice(0, maxLength);
            }
            if (context.expireTime) {
                // ... plugins
            }
            if (!context.unlocal) {
                context.setItem?.(property, _value)
            }

            return Reflect.set(target, property, value, receiver)
        }
    })
}

CreateStore.prototype.getItem = function (type) {
    if (!window) {
        throw new ErrorEvent('brower runtime need ...')
    }
    const data = window[this.storageMethod].getItem(type)
    let dataJSON;
    try {
        dataJSON = JSON.parse(data)
    } catch (error) {
        throw new Error(error)
    }

    return dataJSON;
}

CreateStore.prototype.setItem = function (type, data) {
    if (!window) {
        throw new ErrorEvent('brower runtime need ...')
    }
    const dataJSON = JSON.stringify(data);
    window[this.storageMethod].setItem(type, dataJSON)
}

// 让CreateStore.prototype具备一些数组方法
const methodArr = ['pop', 'push', 'unshift', 'shift', 'reverse', 'splice']
methodArr.forEach((method) => {
    CreateStore.prototype[method] = function (type, ...rest) {
        if (!this.get(type)) {
            this.set(type, [])
        }
        if (!this.get(type) instanceof Array) {
            throw new Error('must be array')
        }
        const dataList = this.get(type)
        Array.prototype[method].apply(dataList, rest)
        this.set(type, dataList)
    }
})


const CreateLocalStore = function (bizcode, ...rest) {
    CreateStore.apply(this, rest);
    this.bizcode = bizcode
    this.storageMethod = 'localStorage'
}

CreateLocalStore.prototype = Object.create(CreateStore.prototype)
CreateLocalStore.prototype.constructor = CreateLocalStore;

/* --------⬆CreateLocalStore---------fn:setItem------⬇CreateSessionStore--------- */

CreateStore.prototype.setItem = function (type, data) {
    if (!window) {
        throw new ErrorEvent('brower runtime need ...')
    }
    const dataJSON = JSON.stringify(data);
    window[this.storageMethod].setItem(type, dataJSON)
}

const CreateSessionStore = function (bizcode, ...rest) {
    CreateStore.apply(this, rest);
    this.bizcode = bizcode
    this.storageMethod = 'SessionStorage'
}

CreateSessionStore.prototype = Object.create(CreateStore.prototype)
CreateSessionStore.prototype.constructor = CreateSessionStore;

// 初始化
export const localStore = new CreateLocalStore('zq')


// 想实现 localStore.push('xxxxx')