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
}
