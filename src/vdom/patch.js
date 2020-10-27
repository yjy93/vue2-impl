export function patch(oldVnode, vnode) {
  // oldVnode 是一个真实的元素

  // 1. 组件 oldVnode 是null
  if (!oldVnode) {
    return createElm(vnode) // 根据虚拟节点创建元素
  }

  const isRealElement = oldVnode.nodeType
  // 2. 初次渲染 oldVnode 是一个真实的 dom
  if (isRealElement) {
    // 初次渲染
    const oldElm = oldVnode; //id="app"
    const parentElm = oldElm.parentNode

    let el = createElm(vnode) // 根据虚拟节点创建真实节点
    parentElm.insertBefore(el, oldElm.nextSibling); // 将创建的节点, 插到原有的节点的下一个
    parentElm.removeChild(oldElm)
    return el; // vm.$el
  } else {
    // 3. diff 算法, 两个虚拟节点的比对

    // 1. 如果两个虚拟节点的标签不一致, 那就直接替换掉老节点
    if (oldVnode.tag !== vnode.tag) {
      return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
    }
    // 2. 标签一样, 但是是两个文本元素 {tag:undefined,text:'Gene'} text为文本内容
    if (!oldVnode.tag) { // 标签相同,而且是文本的时候
      if (oldVnode.text !== vnode.text) {
        return oldVnode.el.textContent = vnode.text
      }
    }

    // 3. 元素相同, 复用老节点,并且更新属性
    let el = vnode.el = oldVnode.el // 复用真实老节点
    // 用老的 属性, 和新的虚拟节点进行比对
    updateProperties(vnode, oldVnode.data)

  }
}

// 更新节点属性
function updateProperties(vnode, oldProps = {}) { // 更新标签属性
  let newProps = vnode.data || {} // 属性
  let el = vnode.el // dom 元素


  // 1. 老的属性,新的没有 删除属性
  for (let key in oldProps) {
    if (!newProps[key]) { // 如果老的属性, 新的没有, 则删除老的属性
      el.removeAttribute(key)
    }
  }

  // 标签中的样式
  let newStyle = newProps.style || {}
  let oldStyle = oldProps.style || {}
  // 判断样式时 如果老的标签有样式, 新的没有,则移除老的样式
  for (let key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = ''
    }

  }
  // 2. 新的属性, 老的没有. 直接用新的属性覆盖老的属性,不考虑有没有
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

// 创建组件
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
export function createElm(vnode) {
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


