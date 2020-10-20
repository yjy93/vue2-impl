// vue 的数据有很多种 data computed watch ...
import {observe} from "./observer/index.js"

export function initState(vm) {
    // 将所有数据都定义在 vm 属性上, 并且后续更改, 需要触发视图更新
    const opts = vm.$options; // 获取用户传入的属性

    if (opts.data) { // 数据的初始化
        initData(vm);
    }
}

function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        },
        set(newValue) {
            vm[source][key] = newValue
        }
    })
}

function initData(vm) {
    // 数据劫持 Object.defineproperty()

    let data = vm.$options.data
    // 对 data 类型进行判断, 如果是函数, 获取函数返回值作为对象
    data = vm._data = typeof data === 'function' ? data.call(vm) : data

    // 通过 vm._data获取劫持后的数据, 用户就可以拿到 _data 了
    // 将 _data 中的数据, 全部放到 vm 上, 代理到 vm上
    for (let key in data) {
        proxy(vm, '_data', key)
    }
    // 观测这个数据
    observe(data)
}

