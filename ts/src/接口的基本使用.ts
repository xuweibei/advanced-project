//接口的概念是：1）用来描述数据的形状的 2）接口中乜有具体的实现（抽象的）

//和type的区别在于 type可以使用联合类型
interface ISum11{
	(a:string,b:string):string | number
}

let sum11:ISum11 = (x:string,y:string):string =>x+y


interface IFruit{
	color:()=>string
	size:number
}
let o = {
	color:()=>'abc',
	size:13,
	xxx:123
}
let fruit1:IFruit = o

let fruit2:IFruit = ({
	color:()=>'nnn',
	size:12,
	xxx:22
}) as IFruit

interface newFruit extends IFruit{
	xxx:number
}

let fruit3:newFruit = {
	color:()=>'eee',
	size:12,
	xxx:22
}