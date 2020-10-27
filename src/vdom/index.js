// 创建虚拟节点 dom
import {isObject, isReservedTag} from "../util"

export function createElement(vm, tag, data = {}, ...children) {
  // 需要对 标签名做过滤, 因为有可能标签名是一个自定义组件
  if (isReservedTag(tag)) {
    return vnode(vm, tag, data, data.key, children, undefined)
  } else {
    // 组件
    const Ctor = vm.$options.components[tag] // Ctor 可能是对象, 也可能是函数
    return createComponent(vm, tag, data, data.key, children, Ctor)
  }
}

// 创建组件
function createComponent(vm, tag, data, key, children, Ctor) {
  if (isObject(Ctor)) { // 如果传入的是 对象, 把它转化为 函数
    Ctor = vm.$options._base.extend(Ctor)
  }
  // 给组件增加生命周期
  data.hook = {
    init(vnode) {
      // 调用子组件的构造函数
      let child = vnode.componentInstance = new vnode.componentOptions.Ctor({})
      child.$mount() // 手动挂载 child.$el = 真实的元素
    } // 初始化的勾子

  }
  // 组件的虚拟节点, 拥有 hook 和当前组件 componentOptions 中存放了组件的构造函数
  return vnode(vm, `vue-component-${Ctor.cid}-${tag}`, data, key, undefined, undefined, {Ctor})
}

export function createTextVnode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text)
}

function vnode(vm, tag, data, key, children, text, componentOptions) {
  return {
    vm,
    tag,
    children,
    data,
    key,
    text,
    componentOptions,
  }
}

// 判断两个节点是否为 同一个节点
export function isSameVnode(oldVnode, newVnode) {
  return (oldVnode.tag == newVnode.tag) && (oldVnode.key == newVnode.key)
}
