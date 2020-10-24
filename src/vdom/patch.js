export function patch(oldVnode, vnode) {
  // oldVnode 是一个真实的元素

  if (!oldVnode) {
    return createElm(vnode) // 根据虚拟节点创建元素
  }

  const isRealElement = oldVnode.nodeType
  if (isRealElement) {
    // 初次渲染
    const oldElm = oldVnode; //id="app"
    const parentElm = oldElm.parentNode

    let el = createElm(vnode) // 根据虚拟节点创建真实节点
    parentElm.insertBefore(el, oldElm.nextSibling); // 将创建的节点, 插到原有的节点的下一个
    parentElm.removeChild(oldElm)
    return el; // vm.$el
  } else {
    // diff 算法
  }
}

function createComponent(vnode) {
  let i = vnode.data
  if ((i = i.hook) && (i = i.init)) {
    i(vnode); // 调用组件的初始化方法; vnode.componentInstance.$el
  }
  if (vnode.componentInstance) { // 如果虚拟节点上有组件的实例, 说明当前这个 vnode是组件
    return true;
  }
  return false
}

// 根据虚拟节点创建真实节点
function createElm(vnode) {
  let {tag, children, key, data, text, vm} = vnode
  if (typeof tag === 'string') { // 两种可能,  可能是一个组件, 可能是一个标签
    // 可能是组件, 如果是组件就直接 根据组件创建出组件对应的真实节点
    if (createComponent(vnode)) { // 如果返回 true, 说明这个虚拟节点是组件

      // 如果是组件, 就把组件渲染后的真实元素给我
      return vnode.componentInstance.$el
    }
    vnode.el = document.createElement(tag) // 用 vue的指令时, 可以通过 vnode 拿到真实 dom
    updateProperties(vnode)

    children.forEach((child) => { // 如果有儿子节点, 递归操作
      vnode.el.appendChild(createElm(child))
    })
  } else { // 如果是文本节点,创建文本节点
    vnode.el = document.createTextNode(text)
  }
  return vnode.el;
}

function updateProperties(vnode) { // 更新标签属性
  let newProps = vnode.data || {} // 属性
  let el = vnode.el // dom 元素
  for (let key in newProps) {
    if (key == 'style') {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if (key === 'class') {
      el.className = newProps.class
    } else {
      el.setAttribute(key, newProps[key])
    }
  }

}
