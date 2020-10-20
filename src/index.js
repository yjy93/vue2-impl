// Vue2.0 中 Vue 就是一个 构造函数.

import {initMixin} from "./init"

function Vue(options) {
    console.log('new vue');
    this._init(options) // new Vue的时候调用 init方法进行初始化操作
}

// 初始化操作 将不同的初始化逻辑, 抽离到不同的 文件中, 方便管理和维护
initMixin(Vue)

export default Vue
