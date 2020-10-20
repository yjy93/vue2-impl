import {createElement, createTextVnode} from "./vdom/index"

export function renderMixIn(Vue) {
  Vue.prototype._c = function (...args) { // 创建元素的虚拟节点
    return createElement(this, ...args)
  }
  Vue.prototype._v = function (text) { // 创建文本的虚拟节点
    return createTextVnode(this, text)
  }
  Vue.prototype._s = function (val) { // 转换成字符串
    return val == null ? '' : (typeof val == 'object') ? JSON.stringify(val) : val
  }

  Vue.prototype._render = function () {
    const vm = this
    let render = vm.$options.render // 获取编译后的render方法
    // 调用 render 方法, 产生虚拟节点
    let vnode = render.call(vm); // _c(xx,xx,xx) 等方法 返回的vnode
    console.log('render 后的 vnode --->',vnode);
    return vnode; // 虚拟节点
  }
}
