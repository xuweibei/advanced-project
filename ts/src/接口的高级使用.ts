
//as const表述对应的内容都是只读的
const x = {name:'12'} as const;
// {name:'12'} 用变量来替代还不行

//和type的区别在于 
// 第一 type可以使用联合类型
// 第二 interface同名可以合并 type重名会报错
// 第三 interface可以继承扩展，type不行


interface IV{
	color:string,
	age:number
}

interface IV{
	size?:number
}

interface MyV extends IV{
	[a:string]:any //这样的写法就可以兼容多出来的那些属性了 
}

let ru:MyV = {
	color:'red',
	age:18,
	xxx:123
}


//抽象类，abstract增加，增加后不能被new ，抽象类可以定义抽象方法
//定义后的抽象方法子类必须声明
//抽象类中可以存着非抽象的方法或属性
abstract class A {
	abstract eat():void
	speak(){
		console.log('spack')
	}
}

class B extends A{
	eat(): void {
		
	}
}

//接口也可以限制类型，接口中不能有非抽象的方法，接口中的都是抽象的，不能有具体的实现

interface IEat{
	eat:()=>void //这样写就是放在实例上了
}

interface Idrink{
	drink():void //这样写就是放在原型上了
}

class Tom implements IEat,Idrink{
	eat: () => void;
	drink(): void {
		throw new Error("Method not implemented.");
	}
}

//接口来描述构造函数

class Cat12{
	constructor(public name:string,public age:number){}
}
// type IClazz = new (name:string,age:number)=>any;
interface IClazz {
	new (name:string,age:number) :any
}

function getInstance(clazz:IClazz,name:string,age:number){
	return new clazz(name,age)
}

let tu = getInstance(Cat12,'tom',20)


