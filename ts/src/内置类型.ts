
//Pick 在对象中挑选 源码 PickDemo

interface IAnimal {
	type:string,
	name:string,
	age:number
}
type PickDemo<T extends object,K extends keyof T>={[M in K]:T[M]}
type PickDemo2 = PickDemo<IAnimal,'type'|'age'>


//Omit 去除某一个属性 源码OmitDemo
type OmitDemo <T extends object,K extends keyof T> = {[M in Exclude<keyof T,K>]:T[M]}
type OmitType = OmitDemo<IAnimal,'age'>


// Record 记录
function mapping<K extends keyof any,V,R>(obj:Record<K,V>,cb:(key:K,val:V)=>R):Record<K,R>{
	let result  = {} as Record<K,R>
	for(let key in obj){
		result[key] = cb(key,obj[key])
	}
	return result
}









