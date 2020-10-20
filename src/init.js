// 初始化 代码
import {initState} from "./state"
import {compileToFunctions} from "./compiler/index"
import {mountComponent} from "./lifecycle"

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = options // 实例上有个属性 $options, 表示的是用户传入的所有属性

    // 初始化 状态 数据
    initState(vm)

    if (vm.$options.el) { // 数据可以挂载到页面上
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$mount = function (el) {
    el = document.querySelector(el)
    const vm = this
    const options = vm.$options
    vm.$options.el = el
    // 如果有 render 就直接使用 render方法
    // 如果没有 render 看有没有 template 属性
    // 没有 template 就接着找外部模板
    if (!options.render) {
      let template = options.template
      if (!template && el) {
        template = el.outerHTML
        // 获取到的 template

        // "<div id="app">
        //     <ul>
        //         <li>{{name}}</li>
        //         <li>{{age}}</li>
        //     </ul>
        // </div>"
      }

      // 获取到 字符串模板后, 把其编译
      // 如何将模板编译成 render 函数
      const render = compileToFunctions(template)
      options.render = render // 保证 render 方法一定存在
    }
    // 组件挂载
    mountComponent(vm, el);
  }
}


