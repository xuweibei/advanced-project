interface Bird{
	name:'鸟'
}

interface Fish{
	name:'鱼'
}

interface Sky{
	color:'蓝色'
}

interface Water{
	color:'透明'
}

//通过条件判断的方式返回对应的类型，如果放入的是联合类型那么具备 分发 能力，如果放入的不是联合类型就不具备
//只能在裸类型中使用，如果泛型被包裹，那么就不会产生分发效果
type IChangeEnv<T extends Fish | Bird> = T extends Fish ? Sky :Water
type IEnv = IChangeEnv<Fish | Bird>



//Exclude 去除某一个类型
type EXcludeType = Exclude<number|string|boolean,string>

//Extract
// type Extract1<T,K> = T extends K ? T :never
type ExtractType = Extract<number|string,number>

let r = document.getElementById('root');
type NoNullType = NonNullable<typeof r>






//循环内置的类型
interface Person{
	name:string,
	age:number,
	haha:{
		a:string
	}
}
type PartialDemo<T extends object> = {
	[K in keyof T]?:T[K] //浅遍历
	// [K in keyof T]?: T[K] extends object?PartialDemo<T[K]>:T[K] //深遍历 
}

//Partial 让每个属性设置为非必填 浅遍历
type PartialPerson = Partial<Person>

//Required 让每个属性设置为必填

type RequiredType = Required<Person>





