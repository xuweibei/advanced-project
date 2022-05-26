//module.exports = exports = {} 这里不能直接改变exports的应用，不会影响module.exports
// exports = 'hello world';
// 这里最终使用的是 module.exports;
// exports.a = 'hello world' ，这个会直接影响modules.exports;
// this = exports可以直接使用this代替
// 如果写了module.exports 又写了exports 则module.exports优先级更高
// module.exports导出的是一个具体的值，这个值即使在模块中被改变了，再次引用也是原来的值。
// global是全局对象，小心使用，小心全局污染

const path = require('path');
const fs = require('fs')


function Module(id){
	this.id = id;
	this.exports = {

	}
}
Module._cache = Object.create(null);
Module._extenstions = {
	'.js'(module){
		let jsonStr = fs.readFileSync(module.id,'utf-8');
		module.exports = JSON.parse(jsonStr)},
	'.json'(module){
		let jsonStr = fs.readFileSync(module.id,'utf-8');
		module.exports = JSON.parse(jsonStr)
	},
	'.ts'(){}
}
Module._resolveFilename = function(id){
	const filepath = path.resolve(__dirname,id);
	const exts = Object.keys(Module._extenstions);
	for(let i = 0;i<exts.length;i++){
		let newPath = filepath + exts[i];
		if(fs.existsSync(newPath)) return newPath;
	}
	throw new Error(`annot find module ${id}`)
}
Module.prototype.load = function(filename){
	let ext = path.extname(filename);
	Module._extenstions[ext](this)
}

function myRequire(id){
	const absPath = Module._resolveFilename(id);
	const module = new Module(absPath);
	if(Module._cache[absPath])return Module._cache.exports;
	Module._cache[absPath] = module;
	module.load(absPath);
	return module.exports;
}

const result = myRequire('./a');
console.log(result)