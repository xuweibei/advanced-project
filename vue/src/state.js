import { observe } from './observe/index.js';

export function initState(vm) {
  const opts = vm.$options;
  if (opts.data) {
    initData(vm);
  }
}
function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get() {
      console.log(key, 2);
      return vm[target][key];
    },
    set(newValue) {
      vm[target][key] = value;
    },
  });
}
function initData(vm) {
  let data = vm.$options.data; //data可能是函数或对象
  data = typeof data === 'function' ? data.call(vm) : data;
  vm._data = data;
  observe(data);
  for (let i in data) {
    proxy(vm, '_data', i);
  }
}
