// namespace 一般用不到，编写声明文件的时候可能用到
// 一个模块中，想维护多段逻辑，而且逻辑中有重名的部分，希望代码互不干扰就使用他
namespace Zoo{
	export class Monkey{}
}
Zoo.Monkey


// 策略： 1）namespace可以用来和类合并，如下，但类必须写在前面
//       2）namespace可以用来和函数合并，如下，但函数必须写在前面
//       3) namespace可以用来和枚举合并，如下，位置无所谓
//       4) namespace无法和interfe合并
//       5) 同名的namespa可以合并

// class Home{}
// function Home(){}
namespace Home{
	export class Monkey{}
}
// enum Home{

// }




