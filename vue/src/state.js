import Dep from './observe/dep.js'
import { observe } from './observe/index.js'
import Watcher, { nextTick } from './observe/watcher.js'

export function initState(vm) {
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm)
  }
  if(opts.watch){
    initWatch(vm)
  }
}
function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get() {
      // console.log(key, 2);
      return vm[target][key]
    },
    set(newValue) {
      vm[target][key] = newValue
    }
  })
}
function initData(vm) {
  let data = vm.$options.data //data可能是函数或对象
  data = typeof data === 'function' ? data.call(vm) : data
  vm._data = data
  observe(data)
  for (let i in data) {
    proxy(vm, '_data', i)
  }
}

function initComputed(vm) {
  const computed = vm.$options.computed
  let watchers = (vm._computedWatchers = {})
  for (let key in computed) {
    let userDef = computed[key]
    let fn = typeof userDef === 'function' ? userDef : userDef.get
    watchers[key] = new Watcher(vm, fn, { lazy: true })
    defineComponted(vm, key, userDef)
  }
}

function defineComponted(target, key, userDef) {
  const setter = userDef.set || (() => {})
  Object.defineProperty(target, key, {
    get: createComputedGetter(key),
    set: setter
  })
}

function createComputedGetter(key) {
  return function () {
    const watcher = this._computedWatchers[key]
    if (watcher.dirty) {
      watcher.evaluate()
    }
    if(Dep.target){
      watcher.depend()
    }
    return watcher.value
  }
}


function initWatch(vm){
  let watch = vm.$options.watch;
  for(let key in watch){
    const handler = watch[key];
    if(Array.isArray(handler)){
      for(let i = 0; i <handler.length;i++){
        createWatcher(vm,key,handler[key])
      }
    }else{
      createWatcher(vm,key,handler)
    }
  }
}

function createWatcher(vm,key,handler){
  if(typeof handler === 'string'){
    handler = vm[handler];
  }
  return vm.$watch(key,handler)
}

export function initStateMixin(Vue){
  Vue.prototype.$nextTick = nextTick
  Vue.prototype.$watch = function (exprOrFn, cb, options) {
    new Watcher(this, exprOrFn, { user: true }, cb)
  }
}