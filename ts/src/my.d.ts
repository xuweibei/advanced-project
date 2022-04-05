// 使用declare 都是全局的，可以直接声明，但是不能有具体的实现

declare let jquaryName = 'jquery';

declare function $():{
	css(key:string,val:number):void
}

namespace ${
	export function fn(){

	}
}

// export {}  如果加上了这个，表示上面声明的内容变成局部的了，就不是全局的了