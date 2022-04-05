// infer 自动推断类型

function getUserInfo(name:string,age:number){
	return {name:'zf',age:12}
}
//ReturnType可以在不执行函数的前提下返回函数的返回值类型。ReturnTypDemo是源码
type ReturnTypDemo<T> = T extends (...arg:any[])=>infer R ? R:never

type MyReturnType = ReturnType<typeof getUserInfo>

//Parameters 获取函数的参数类型ParametersDemo是源码

type ParametersDemo<T> = T extends (...arg:infer P )=>any?P:never

type MyParamaters = Parameters<typeof getUserInfo>










