// nextTick 实现原理
// cb 中是渲染逻辑, 解决异步问题, 我们的逻辑应该在渲染逻辑之后
let callbacks = []
let waiting = false

// 循环执行 callbacks 中的每一个函数
function flushCallback() {
  for (let i = 0; i < callbacks.length; i++) {
    let callback = callbacks[i]
    callback()
  }
  waiting = false;
  callbacks = []
}

// 批处理 第一次开异步, 后续只更新列表, 最后执行清空逻辑
// nextTick 实现
// 1. 第一次 cb 是渲染 watcher 更新操作
// 2. 第二次 cb 是用户传入的回调, 用户的 cb 一定在渲染 cb 之后.
export function nextTick(cb) {
  callbacks.push(cb) // 默认的 cb 是渲染逻辑, 用户的逻辑放到渲染逻辑之后即可
  if (!waiting) {
    waiting = true
    // 1. promise 先看支持不支持
    // 2. 如果不支持 promise mutationObserver
    // 3. setImmediate
    // 4. setTimeout  Vue3 的 nextTick 就直接使用了 promise
    Promise.resolve().then(flushCallback) // 多次调用 nextTick, 只会开启一个 Promise
  }
}

// nextTick 肯定有 异步功能
