import Dep from './dep.js';
let id = 0;
export default class Watcher {
  constructor(vm, fn, options) {
    this.id = id++;
    console.log(this.id, '跨境电商');
    this.renderWatcher = options;
    this.getter = fn;
    this.deps = [];
    this.depsId = new Set();

    this.get();
  }
  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep);
      dep.addSub(this);
    }
  }
  get() {
    Dep.target = this;
    this.getter();
    Dep.target = null;
  }
  update() {
    queueWatcher(this);
  }
  run() {
    console.log(111);
    this.get();
  }
}

let queue = [];
let has = {};
let pending = false;
function flushSchedulerQueue() {
  let flushQueue = queue.slice(0);
  queue = [];
  has = {};
  pending = false;
  flushQueue.forEach((q) => q.run());
}

function queueWatcher(watcher) {
  const id = watcher.id;
  if (!has[id]) {
    queue.push(watcher);
    has[id] = true;
    if (!pending) {
      pending = true;
      console.log(22);
      nextTick(flushSchedulerQueue);
    }
  }
}
let callback = [];
let waiting = false;
function flushCallbacks() {
  let cbs = callback.slice(0);
  waiting = false;
  callback = [];

  console.log(cbs, '绝对是李开复');
  cbs.forEach((item) => item());
}

let timerFunc;
if (Promise) {
  timerFunc = () => {
    Promise.resolve().then(flushCallbacks);
  };
} else if (MutationObserver) {
  let observer = new MutationObserver(flushCallbacks);
  let textNode = document.createTextNode(1);
  observer.observe(textNode, {
    characterData: true,
  });
  timerFunc = () => {
    textNode.textContent = 2;
  };
} else if (setImmediate) {
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks);
  };
}

export function nextTick(cb) {
  callback.push(cb);
  if (!waiting) {
    waiting = true;
    setTimeout(() => {
      flushCallbacks();
    }, 0);
  }
}
