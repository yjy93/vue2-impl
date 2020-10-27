// Vue2.0 中 Vue 就是一个 构造函数.

import {initMixin} from "./init"
import {lifecycleMixIn} from "./lifecycle"
import {renderMixIn} from "./render"
import {initGlobalAPI} from "./global-api/index"
import {compileToFunctions} from "./compiler/index"
import {createElm, patch} from "./vdom/patch"

function Vue(options) {
  // new Vue的时候调用 init方法进行初始化操作 初始化 options
  this._init(options)
}

// 初始化操作 将不同的初始化逻辑, 抽离到不同的 文件中, 方便管理和维护
initMixin(Vue)
lifecycleMixIn(Vue) // 扩展 _update 方法
renderMixIn(Vue) // 扩展 _render方法

// 混合全局的 API
initGlobalAPI(Vue)

// 我们自己构建两个虚拟 dom, 之后手动进行比对
let vm1 = new Vue({
  data() {
    return {name: 'Gene'}
  }
})
// 将模板编译成 render 函数
let render1 = compileToFunctions(`<div id="a" a="1" style="color:blue">
    <li key="A">A</li>
    <li key="B">B</li>
    <li key="C">C</li>
    <li key="D">D</li>
</div>`)
let oldVnode = render1.call(vm1); // 老的虚拟节点
let el = createElm(oldVnode)
document.body.appendChild(el)

let vm2 = new Vue({
  data() {
    return {name: '杨阳'}
  }
})
let render2 = compileToFunctions(`<div id="b" b="1" style="background: red">
    <li key="A">A</li>
    <li key="B">B</li>
    <li key="C">C</li>
    <li key="D">D</li>
    <li key="E">E</li>
</div>`)
let newVnode = render2.call(vm2)

setTimeout(() => {
  patch(oldVnode, newVnode); // 包括了初渲染 和 diff 算法的流程
}, 2000)

export default Vue
