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
    // 第一次初始化, 第二次走 diff 算法
    const prevVnode = vm > _vnode // 先取上一次的 vnode,看一下是否有
    vm._vnode = vnode // 保存上一次的虚拟节点
    if (!prevVnode) { // 第一次 prevVnode 没有, 则是初渲染
      vm.$el = patch(vm.$el, vnode) // 组件调用 patch 方法会产生 $el 属性
    } else {
      vm.$el = patch(prevVnode, vnode)// 第二次渲染, 开始 diff 比较
    }
  }
}

// 调用声明周期勾子函数的方法
export function callHook(vm, hook) { // 发布模式
  const handlers = vm.$options[hook]
  if (handlers) {
    handlers.forEach((hander) => hander.call(vm))
  }
}

export function mountComponent(vm) {
  // 默认 vue 是通过watch 来进行渲染的 = 渲染 watcher (每一个组件都有一个渲染watcher)
  let updateComponent = () => {
    // 虚拟节点, 先调 render, 再调 update
    vm._update(vm._render())
  }
  new Watcher(vm, updateComponent, () => {
    //
  }, true) // true 表示它是一个渲染 watcher, 执行 updateComponent()
}
