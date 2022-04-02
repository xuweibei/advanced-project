//类型断言 我不知道是什么类型，我们可以断定他是什么类型

//! ts中的一个标识，非空断言。

// ?? 排除false和''，只要不是null和undefined都为真
// false ?? 1   false
// '' ?? 1   ''
// null ?? 1  1


// as语法
type IValue = number | string | HTMLElement
function getVal(el:IValue){
	(el as HTMLElement).querySelector('root');
	(<HTMLElement>el).querySelector('root');
	//以上两种方法是一样的，建议使用第一种，第二种不是特别好

  (el as any as boolean)//这个叫双重断言，建议不这么使用，破坏原有类型，可能会发生意想不到的事情
}