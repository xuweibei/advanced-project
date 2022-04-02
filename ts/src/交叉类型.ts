interface IPerson1{
	handsome:string,
	name1:string
}

interface IPerson2{
	high:string,
	name1:number
}

type Spread<T extends object>={
	[K in keyof T]:T[K] // in 只能用于type，不能用于interface
}

type IPerson3 = Spread<IPerson1 &IPerson2>

let name1!:never
let person3:IPerson3={
	handsome:'12',
	high:'321',
	name1
}