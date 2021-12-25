import { newArrayProto } from './array';

class Observer {
  constructor(data) {
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false, //将这个属性置为不可枚举，否则会死循环
    });
    if (Array.isArray(data)) {
      data.__proto__ = newArrayProto;
      this.observeArray(data);
    } else {
      this.walk(data);
    }
  }
  walk(data) {
    Object.keys(data).forEach((item) => defineReactive(data, item, data[item]));
  }
  observeArray(data) {
    data.forEach((item) => observe(item));
  }
}
export function defineReactive(target, key, value) {
  observe(value);
  Object.defineProperty(target, key, {
    get() {
      console.log(key);
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      observe(value);
      value = newValue;
    },
  });
}

export function observe(data) {
  if (typeof data !== 'object' || data == null) {
    return;
  }
  if (data.__ob__ instanceof Observer) {
    //说明数据已经被观测了
    return data.__ob__;
  }
  return new Observer(data);
}
