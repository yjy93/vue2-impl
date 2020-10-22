// 我们可以把当前的 watcher 放到一个全局变量上
let id = 0;

class Dep {
  constructor() {
    this.id = id++
    this.subs = [] // 属性要记住 watcher
  }

  // 让 watcher 记住 dep
  depend() { //  Dep.target 指的是 watcher
    Dep.target.addDep(this) // 让 watcher 记住 dep
  }

  // 让 dep 记住 watcher
  addSub(watcher) {// 存储 watcher
    this.subs.push(watcher)
  }

  notify() {
    this.subs.forEach((watcher) => {
      watcher.update()
    })
  }
}

Dep.target = null

export function pushTarget(watcher) {
  Dep.target = watcher
}

export function popTarget() {
  Dep.target = null
}

export default Dep
