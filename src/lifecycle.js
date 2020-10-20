// 挂载组件方法
import Watcher from "./watcher"

export function lifecycleMixIn(Vue) {
    Vue.prototype._update = function (vnode) {
        console.log('update');
    }
}

export function mountComponent(vm, el) {
    // 默认 vue 是通过watch 来进行渲染的 = 渲染 watcher (每一个组件都有一个渲染watcher)
    let updateComponent = () => {
        // 虚拟节点, 先调 render, 再调 update
        vm._update(vm._render())

    }
    new Watcher(vm, updateComponent, () => {
        //
    }, true) // true 表示它是一个渲染 watcher, 执行 updateComponent()
}
