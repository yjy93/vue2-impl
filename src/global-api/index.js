// 混合全局的 API
import {mergeOptions} from "../util"

export function initGlobalAPI(Vue) {
  Vue.options = {} // 用来存储全局的配置
  Vue.mixin = function (mixin) {
    // mergeOptions
    this.options = mergeOptions(this.options, mixin)
    console.log(this.options);
    return this;
  }
  /**
   * @param id 组件名
   * @param definition: 组件的定义
   */
  Vue.options._base = Vue; // _base 用来存Vue的构造函数, 后面会用到
  Vue.options.components = {} // 用来存放组件的定义
  Vue.component = function (id, definition) {
    definition.name = definition.name || id;
    // definition = this.options._base.extend(definition); // 通过对象产生一个构造函数
    this.options.components[id] = definition
    console.log(this.options);
  }

  Vue.extend = function (options) { // 子组件初始化时会 new VueComponent(options)
    // new VueComponent(options)
    const Super = this;
    const Sub = function VueComponent(options) { // 产生一个子类 Sub 类
      this._init(options)
    }
    // 原型继承
    Sub.prototype = Object.create(Super.prototype)
    Super.prototype.constructor = Sub;
    Sub.component = Super.component
    Sub.options = mergeOptions(Super.options, options)
    return Sub; // 这个构造函数由对象产生而来的.
  }
}
