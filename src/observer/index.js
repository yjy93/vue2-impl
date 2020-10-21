// 观测数据

import {arrayMethods} from "../array"

class Observer {
    // 对这个 value 属性(对这个 data 数据), 重新定义
    constructor(value) {
        // value.__ob__ = this
        Object.defineProperty(value, '__ob__', {
            value: this,
            enumerable: false, // 不能被枚举,表示不能被循环
            configurable: false, // 不能删除此属性
        })
        // value 可能是对象, 也可能是数组, 分类处理
        if (Array.isArray(value)) {
            // 数组不用 defineProperty 来进行代理, 性能不好
            // value.__proto__.arrayMethods; // 当是数组时, 改写方法为自己重写后的方法?
            Object.setPrototypeOf(value, arrayMethods)
            this.observeArray(value) // 观测数组中的数据
        } else {
            this.walk(value)
        }
    }

    // 观测数组数据的变化
    observeArray(value) {
        for (let i = 0; i < value.length; i++) {
            observe(value[i]) // 处理的是 原有数组中的对象
        }
    }


    walk(data) {
        // 将对象中的所有 key, 重新用 defineProperty 定义成响应式的
        Object.keys(data).forEach((key) => {
            //
            defineReactive(data, key, data[key])
        })
    }
}

// 拦截 对象中属性,定义成响应式属性
export function defineReactive(data, key, value) {
    // value 可能也是一个对象, 重新观测,如果是对象, 则递归观察, 如果不是对象, 则跳出观察, 代码向下执行
    observe(value); // 对结果递归拦截

    Object.defineProperty(data, key, { // vue2 中数据不要嵌套过深, 过深会浪费性能
        get() {
            return value
        },
        set(newValue) {
            if (newValue === value) return;
            observe(newValue) // 如果用户设置的是一个对象, 就继续将该用户设置的对象变成响应式的
            value = newValue
        }
    })
}

// 观测数据: vm 实例对象中的data
export function observe(data) {
    // 我们需要对这个 数据进行重新定义
    // 只对对象类型进行观测, 非对象类型无法观测
    if (typeof data !== 'object' || data == null) {
        return;
    }

    if (data.__ob__) { // 防止循环引用了
        return
    }

    // 通过类来实现对数据的观测 类可以方便扩展
    return new Observer(data)
}
