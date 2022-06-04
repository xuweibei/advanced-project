// process
// platform/nextTick/cwd/env/argv

console.log(process.platform)
// 导出运行的设备， win/darwin

// cwd current working directory 当前的执行工作目录
console.log(process.cwd(),__dirname)

// 环境变量
console.log(process.env) // cross-env 跨平台设置环境变量
// cross-env NODE_ENV = 100 在命令行中加入这行，process.env.NODE_ENV就可以打印出来。
// 但当进程结束，环境变量就失效，临时性

// 用户命令行交互输入的参数获取，默认会有两个参数，第三个开始就是用户输入的
console.log(process.argv)





