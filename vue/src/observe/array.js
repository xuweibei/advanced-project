const oldArrayProto = Array.prototype;

export let newArrayProto = Object.create(oldArrayProto);

const methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'sort',
  'splice',
];

methods.forEach((item) => {
  newArrayProto[item] = function (...args) {
    const result = oldArrayProto[item].call(this, ...args);
    let inserted;
    let ob = this.__ob__;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
      default:
        break;
    }
    if (inserted) {
      ob.observeArray(inserted);
    }

    return result;
  };
});
