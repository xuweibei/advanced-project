import { createElementVNode, createTextVNode } from './vdom/index';
import Watcher from './observe/watcher';
import { patch } from './vdom/patch';


export function initLifeCycle(Vue) {
  Vue.prototype._update = function (vnode) {
    // console.log('update', vnode);
    const vm = this;
    const el = vm.$el;
    const prevVnode = el._vnode;
    vm._vnode = vnode;
    if(prevVnode){
      vm.$el = patch(prevVnode,vnode)
    }else{
      vm.$el = patch(el, vnode);
    }
  };
  Vue.prototype._c = function () {
    return createElementVNode(this, ...arguments);
  };
  Vue.prototype._v = function () {
    // console.log('c');
    return createTextVNode(this, ...arguments);
  };
  Vue.prototype._s = function (value) {
    if (typeof value === 'object') return value;
    return JSON.stringify(value);
  };
  Vue.prototype._render = function () {
    return this.$options.render.call(this);
  };
}
export function mountComponent(vm, el) {
  vm.$el = el;
  // console.log(vm._render(), '坚实的离开');
  const updateComponent = () => {
    vm._update(vm._render());
  };
  new Watcher(vm, updateComponent, true);
}



export function callHook(vm,name){
  const handlers = vm.$options[name];
  handlers && handlers.forEach(item=>item())
}