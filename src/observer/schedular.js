// 调度 更新几次
import {nextTick} from "../util"

let has = {}
let queue = []

// 刷新 queue 队列
function flushSchedularQueue() {
  for (let i = 0; i < queue.length; i++) {
    let watcher = queue[i]
    watcher.run()
  }
  queue = []
  has = {}
  pending = false;
}

// 多次调用 queueWatcher, 如果 watcher 不是同一个
let pending = false

export function queueWatcher(watcher) {
  // 更新时, 对 watcher 进行去重操作
  let id = watcher.id;
  if (has[id] == null) { // 如果 has 中没有 watcher 的id, 把当前 watcher 存到 queue数组中
    queue.push(watcher)
    has[id] = true
    // 让queue清空
    if (!pending) {
      pending = true
      nextTick(flushSchedularQueue)
    }
  }
}
