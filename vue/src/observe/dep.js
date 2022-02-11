let id = 0;
export default class Dep {
  constructor() {
    this.id = id++;
    this.subs = [];
  }
  depend() {
    Dep.target.addDep(this);
  }
  addSub(watcher) {
    this.subs.push(watcher);
  }
  notify() {
    this.subs.forEach((item) => item.update());
  }
}

Dep.target = null;


let stack = [];

export function pushTarget(watcher){
  stack.push(watcher);
  Dep.target = watcher;
}


export function popTarget(){
  stack.pop();
  Dep.target = stack[stack.length-1]
}
