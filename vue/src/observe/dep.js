let id = 0;
export default class Dep {
  constructor() {
    console.log(id, 'id');
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
