// 初始化 代码
import {initState} from "./state"
import {compileToFunctions} from "./compiler/index"
import {callHook, mountComponent} from "./lifecycle"
import {mergeOptions, nextTick} from "./util"

export function initMixin(Vue) {
  // Vue 是如何渲染的? 1. ast 2. render函数 3. 虚拟节点vnode()

  // 初始化操作
  Vue.prototype._init = function (options) { // options 是用户传入的对象
    const vm = this
    // 实例上有个属性 $options, 表示的是用户传入的所有属性
    // vm.constructor.options === Vue.options
    vm.$options = mergeOptions(vm.constructor.options, options)

    // vm.$options = options

    callHook(vm, 'beforeCreate')
    // 1. 初始化状态数据
    initState(vm)
    callHook(vm, 'created')

    // 如果有 el 选项, 挂载
    if (vm.$options.el) { // 数据可以挂载到页面上
      vm.$mount(vm.$options.el)
    }
  }

  // 把 nextTick 的处理方法放到 Vue 原型上供 用户使用
  Vue.prototype.$nextTick = nextTick
  // 组件挂载
  Vue.prototype.$mount = function (el) {
    el = el && document.querySelector(el)
    const vm = this
    const options = vm.$options
    vm.$el = el
    //1. 如果有 render 就直接使用 render方法
    //2. 如果没有 render 看有没有 template 属性
    //3. 没有 template 就接着找外部模板
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
    mountComponent(vm);
  }
}


