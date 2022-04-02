function sum (a:string,b:string):string{
	return a+b
}

type ISum = (a:string,b:string) =>string

const sum2:ISum = (x:string,y:string):string=>x+y

//对sum2进行了类型标识，就是限制必须按照类型赋予结果

// sum2这样的函数写法才可以使用类型标识，sum就不行

function defaultFN(a:string='',b:string,c?:string){
	return a+b+c
}
defaultFN(undefined,'2')

//c?表示可传可不传，但是这个?不能放到第一个参数


function callThis(this:{name:string},value:string){
	this.name
}
callThis.call({name:'zf'},'abc')
//因为this如果不用形参的方式来写，是拿不到.call里传过去的那个对象的
//this必须放在第一位

//如果.call()第一个对象有很多属性时可以这么操作

function callThis2(this:MyThis,value:string){
	// this.
}
let thisObj = {name:'zf',age:12}
type MyThis = typeof thisObj //typeof 是ts中的，表示去除值对应的类型
callThis2.call(thisObj,'abc')

//函数重载 ，根据参数来决定这个函数是做什么的

function toArray(value:string):string[]
function toArray(value:number):number[]
function toArray(value:string|number){
	if(typeof value === 'string'){
		return value.split('')
	}else{
		return value.toString().split('').map(Number);
	}
}
//箭头函数不能用来重载
