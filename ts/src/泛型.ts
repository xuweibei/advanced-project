interface ICallback<T>{//这里的T类似与传参
	(item: T):void
}
type IForEach = <T>(arr:T[],callback:ICallback<T>)=>void;
let forEach:IForEach = (arr,callback)=>{
	for(let i = 0;i<arr.length;i++){
		callback(arr[i])
	}
}


// 泛型的约束
function sum<T extends number>(a:T,b:T){
	return a+b
}
let val = sum(1,2)
console.log(val)

// 条件的分发 IA,IB满足一个就可以
type IA = {a:1};
type IB = {b:2}
function getVal<T extends IA | IB>(val:T){

}

const aaaaa =  getVal({a:1,v:3})//IA,IB满足一个就可以


//extends表示约束，keyof表示这个类型必须是keyof后面某个对象里的key值
//比如下面的这个例子，这样写了之后，传参的第二个参数就必须是，name或者age 
let o1 = {name:'zf',age:123};
let o2 = {name :'zf2',age:31};


function getValFromKey<T extends object,K extends keyof T>(val:T,key:K){

}

getValFromKey(o1,'name')







