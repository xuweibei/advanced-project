// unknown 和any类似，但是unknown是一个安全类型，使用的时候尽量缩小范围再使用
// 任何类型都是unknown的子类型，如果当前的类型是unknown，只能将这个类型赋予给unknown和any
// unknown不支持keyof

function sum12(a:unknown,b:number){
	if(typeof a ==='number'){
		return a + b
	}
	return a
}
