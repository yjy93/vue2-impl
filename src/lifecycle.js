// 挂载组件方法
import Watcher from "./watcher"
import {patch} from "./vdom/patch"

export function lifecycleMixIn(Vue) {
  Vue.prototype._update = function (vnode) {
    // 将虚拟节点转换成真实的 dom
    const vm = this;

    // 首次渲染, 需要用虚拟节点, 来更新真实的 dom
    // 初始化渲染的时候, 会创建一个新节点, 并且将老节点删掉
    // 第一次渲染完毕后, 拿到新的节点, 再次渲染时,替换上次渲染的结果
    vm.$options.$el = patch(vm.$options.$el, vnode)
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
