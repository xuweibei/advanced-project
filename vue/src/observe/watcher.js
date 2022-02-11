import Dep, { popTarget, pushTarget } from './dep.js'
let id = 0
export default class Watcher {
  constructor(vm, exprOrFn, options, cb) {
    this.id = id++
    this.renderWatcher = options
    if (typeof exprOrFn === 'string') {
      this.getter = function(){
        return vm[exprOrFn]
      }
    } else {
      this.getter = exprOrFn
    }
    this.deps = []
    this.cb = cb
    this.depsId = new Set()
    this.lazy = options.lazy
    this.dirty = this.lazy
    this.user = options.user;
    this.vm = vm
    this.value = !this.lazy && this.get()
  }
  addDep(dep) {
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
  evaluate() {
    this.value = this.get()
    this.dirty = false
  }
  get() {
    pushTarget(this)
    const value = this.getter.call(this.vm)
    popTarget()
    return value
  }
  depend() {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }
  update() {
    if (this.lazy) {
      this.dirty = true
    } else {
      queueWatcher(this)
    }
  }
  run() {
    const oldValue = this.value
    const newValue = this.get()
    if (this.user) {
      this.cb.call(this.vm, newValue, oldValue)
    }
  }
}

let queue = []
let has = {}
let pending = false
function flushSchedulerQueue() {
  let flushQueue = queue.slice(0)
  queue = []
  has = {}
  pending = false
  flushQueue.forEach(q => q.run())
}

function queueWatcher(watcher) {
  const id = watcher.id
  if (!has[id]) {
    queue.push(watcher)
    has[id] = true
    if (!pending) {
      pending = true
      nextTick(flushSchedulerQueue)
    }
  }
}
let callback = []
let waiting = false
function flushCallbacks() {
  let cbs = callback.slice(0)
  waiting = false
  callback = []

  cbs.forEach(item => item())
}

let timerFunc
if (Promise) {
  timerFunc = () => {
    Promise.resolve().then(flushCallbacks)
  }
} else if (MutationObserver) {
  let observer = new MutationObserver(flushCallbacks)
  let textNode = document.createTextNode(1)
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    textNode.textContent = 2
  }
} else if (setImmediate) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks)
  }
}

export function nextTick(cb) {
  callback.push(cb)
  if (!waiting) {
    waiting = true
    setTimeout(() => {
      flushCallbacks()
    }, 0)
  }
}
