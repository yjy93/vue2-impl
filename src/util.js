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

// 判断是否为对象的方法
export const isObject = (val) => typeof val == 'object' && val !== null

const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
]

const strategies = {}// 策略

// 合并声明周期勾子
function mergeHook(parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal)
    } else { // 如果儿子有, 父亲没有
      return [childVal]
    }
  } else {
    return parentVal // 如果儿子没有, 直接采用父亲的
  }

}

LIFECYCLE_HOOKS.forEach((hook) => {
  strategies[hook] = mergeHook
})

// 策略模式 合并 组件
strategies.components = function (parentVal, childVal) {
  const res = Object.create(parentVal)
  if (childVal) {
    for (let key in childVal) {
      res[key] = childVal[key];
    }
  }
  return res
}

// 合并选项
export function mergeOptions(parent, child) {
  const options = {}
  // 自定义的策略
  // 1. 如果父亲有的 儿子也有, 应该用 儿子替换父亲
  // 2. 如果父亲有值, 儿子没有, 应该用父亲的
  for (let key in parent) { // 以 父亲为准, 把 儿子的字段合并
    mergeField(key)
  }

  for (let key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }

  // 合并字段
  function mergeField(key) {
    // 策略模式
    if (strategies[key]) {
      return options[key] = strategies[key](parent[key], child[key])
    }
    if (isObject(parent[key] && isObject(child[key]))) {
      options[key] = {...parent[key], ...child[key]}
    } else {
      if (child[key]) { // 如果儿子有值, 就以儿子的值为主
        options[key] = child[key]
      } else {
        options[key] = parent[key] // 否则就以 父亲的为主
      }
    }
  }

  return options;
}
