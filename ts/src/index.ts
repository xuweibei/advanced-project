// 枚举类型（普通枚举 编译后用普通对象替换）（常量枚举编译后直接用常量替换）（异构枚举 两种以上数据类型）

//普通枚举
// enum STATUS {
//   OK = 200,
//   NOT_FOUND = 404,
// }

//常量枚举
// const enum STATUS1 {
//   OK = 200,
//   NOT_FOUND = 404,
// }
// console.log(STATUS1.OK);

//异构枚举
// enum STATUS2 {
//   OK = 200,
//   NOT_FOUND = 404,
//   a = 'b',
// }

// console.log(STATUS);

//null 和undefined在非严格模式下(strictNullChecks:false) 可以赋予给任何类型（是任何任性的子类型）
let a: number = undefined;

//类型never 1）程序出错 2）死循环 3）走不到的情况
//1)
function throwNewError(): never {
  throw new Error('error');
}
//2)
function whileTrue(): never {
  while (true) {}
}
//3)
type ICircle = { r: number; kind: 'circle' };
type ISquare = { width: number; kind: 'square' };

function validate(obj: never) {}
function getArea(obj: ICircle | ISquare) {
  //联合类型的取值时，只能取到公共的属性 obj.r或者obj.width就不行，这不是公共属性
  if (obj.kind === 'circle') {
    return obj.r * obj.r;
  }
  if (obj.kind === 'square') {
    return obj.width * obj.width;
  }
  validate(obj);
  //通过这个函数来判断上面的判断条件是否全面，上面任何一个条件不写，
  //都有可能会走到这个函数validate，只有写全了所有的可能性，才不会走到这里 这就是走不到的情况
}

//void 类型 函数不写返回值就是void，

function sum3(): undefined {
  return undefined;
}

function sum1(): void {
  return undefined;
}

//object 除了基本类型都可以使用object来标识，标识对象和函数

function create(tar: object) {}
create({ a: 1 });
console.log(222);
