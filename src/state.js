// vue 的数据有很多种 data computed watch ...
import {observe} from "./observer/index.js"

// 初始化状态数据
export function initState(vm) {
    // 将所有数据都定义在 vm 属性上, 并且后续更改, 需要触发视图更新
    const opts = vm.$options; // 获取用户传入的属性

    // 数据的初始化
    if (opts.data) {
        initData(vm);
    }
}

// Vue 中数据代理方法, 把数据 代理到 vm 实例上.
function proxy(vm, source, key) {
    // 通过Object.defineProperty() 方法给 vm 添加属性,并且给属性添加 getter 和 setter方法,完成数据劫持
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        },
        set(newValue) {
            vm[source][key] = newValue
        }
    })
}

// 初始化状态数据...
function initData(vm) {
    // 数据劫持 Object.defineProperty()
    let data = vm.$options.data
    // 对 data 类型进行判断, 如果是函数, 获取函数返回值作为对象
    data = vm._data = typeof data === 'function' ? data.call(vm) : data

    // 通过 vm._data获取劫持后的数据, 用户就可以拿到 _data 了
    for (let key in data) {
        // 将 _data 中的数据, 全部代理到 vm上, => 添加 getter, setter方法, 实现数据的拦截
        proxy(vm, '_data', key)
    }

    // 观测这个数据 如何响应式处理数据, 这里用到了 observe
    observe(data)
}

