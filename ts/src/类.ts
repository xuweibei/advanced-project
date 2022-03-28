//


//ts类中使用this，需要先声明类型之后再使用
class Circle{
	x:number
	y:number
	constructor(x:number,y:number){
		this.x= x;
		this.y = y
	}
}
//属性修饰符 public
class Circle1{
	constructor(public x:number,public y:number){
		this.x= x;
		this.y = y
	}
}

//public 公开的，所有人都可以访问
//private 私有的，只能自己访问别人不行。
//protected 受保护的，子类可以访问，自己可以访问，外界不能访问
//以上三个属性可以放在constructor前，用来控制对应类的使用情况，结果就是每个属性描述的内容、
//readonly 表示只能在初始化的时候修改值，初始化之后就不能修改 类似const
class Animal{
	public readonly name:string
	constructor(name:string,private age:number,protected tall:number){
		this.name = name
	}
}

class Cat extends Animal{
	constructor(name:string,age:number,tall:number){
		super(name,age,tall)
		this.tall = tall
		// this.name = '21' name表明是了readonly属性，所以不能这样改了
		// this.age age是私有属性，不能这里访问
	}
}

const cat = new Cat('tom',18,12)
// cat.tall 这样访问就不行了



class Animal2{
	name:string
	constructor(name:string){
		this.name = name;
	}
	eat(val:string):void{//原型上的方法是共享的，这里的void指代的是不关心返回值

	}
	static drink(){ //静态方法只能通过类来调用

	}
}

class Cat2 extends Animal2{
	constructor(public name:string){
		super(name)
	}

	//这个type是放在实例上的，
	get type (){//如果想添加原型属性 可以通过getter来添加类的属性访问器
		return {}
	}
	static get xxx(){
		return 'xxx'
	}
	eat(val:string):string{///子类重写父亲的方法 类型参数需要一直
		super.eat(val);//super指代的是 父类的.prototype
		return 'abc'
	}
}


//和es6中的用法是一样的，区别就在于多了属性修饰符和类型标注