// Vue2.0 中 Vue 就是一个 构造函数.

import {initMixin} from "./init"
import {lifecycleMixIn} from "./lifecycle"
import {renderMixIn} from "./render"
import {initGlobalAPI} from "./global-api/index"

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

export default Vue
