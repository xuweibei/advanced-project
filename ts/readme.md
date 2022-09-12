ts 是 js 的超级，包含了 es 最新的语法，在此基础上做了类型校验

String / string
（小写的为基本类型，大写的为类类型）
let num:number = 12;
let num2:number = Number(21)

let num3:Number = new Number(2)//这里需要描述实例，而不是基本类型，所以需要用大写

类类型是可以描述基本类型,但是建议不这么使用
let num4:Number = 123;

ts 中衍生了一种类型
元组：限制长度和顺序的数组
let arr:[string,number,boolean] = ['1',2,true]
可以使用 push，但是不能 arr[3]这样进行更改，规定

枚举类型（普通枚举）（常量枚举）（异构枚举）

普通枚举
enum Sring{
	lala='haha',
	haha = 'haha'
}

如果设置了某一个为字符串后，其他的fileds也必须要赋值，否则会报错

常量枚举

enum Color {
	Red,
	Blue
}
默认上面的值从0开始，往下累计加1；
Color.Red = 0;
Color.Blue = 1;

如果设置了初始值，比如 
enum Color{
	Red = 1;
	Blue;
}
这时Color.Red = 1;Color.Blue = 2;

异构枚举
enum Yi{
	lala = 'lala',
	Red=0
}

里面有上面两种类型的值就是异构枚举

