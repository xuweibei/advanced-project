const { resolve } = require('path')
const path =require('path')//处理路径


// let p = require('./a'); require的效果相当于读取文件，把里面的代码读过来，类似下面的代码
// let p = function(){ module.exports = class Promise ;return module.exports}
// console.log(arguments)
console.log(path.resolve('a.js')) // 这个方法表示根据路径解析出一个绝对路径（不一定准确）
console.log(path.join('a.js','b','c'))//只负责路径的拼接没有其他任何功能

console.log(path.resolve(__dirname,'a.js'))//加了__dirname就可以获取到准确的路径

//当拼接的内容包含'/'符号时，resolve方法就会解析成根路径，而join方法会正常解析
console.log(path.resolve('a.js','/'))
console.log(path.join('a.js','/'))


console.log(path.basename('a.js'))
console.log(path.extname('a.js'))
console.log(path.dirname(path.resolve(__dirname,'a.js')))

// 1.node --inspect-brk 1.js （在命令行中输入）
// 2.chrome://inspect (在浏览器中输入)
// 这个命令可以直接在浏览器中进行代码调试






