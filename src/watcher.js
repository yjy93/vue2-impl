//
import {popTarget, pushTarget} from "./observer/dep"

let id = 0;

class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.cb = cb;
    this.options = options;
    this.id = id++; // 没一次 new Watcher 的时候, 让 id++
    // 调用传入的函数 updateComponent, 即调用了 render渲染函数, 此时会对模板中的数据进行取值
    this.getter = exprOrFn;
    this.deps = []
    this.depsId = new Set();
    this.get()
  }

  // Dep.target = watcher 让 Dep 记住 watcher
  get() {// 这个方法中, 会对属性进行取值操作
    pushTarget(this) // 给 Dep.target = watcher
    this.getter() // 会取值
    popTarget() // 取完值后再删除 target
  }

  // 让 watcher 记住dep
  addDep(dep) {
    console.log('dep.id -->', dep.id);
    let id = dep.id
    // 如果没有这个 dep 才将其存入
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }

  // dep中调用 watcher 的update, update中,再调用 this.get(), 重新渲染
  update() { //
    this.get()
  }

  // 当属性取值时, 需要记住这个 watcher, 稍后数据变化了, 去执行自己记住的 watcher

}

export default Watcher
