process.nextTick(()=>{ //新增的微任务
	console.log('nextTick')
})

console.log('abc');

Promise.resolve().then(()=>{
	console.log('promise')
})

setImmediate(()=>{ // 新增的宏任务
	console.log('setImmediate')
})

setTimeout(()=>{
	console.log('setTimeout')
})

//abc
//nextTick
//promise
//setTimeout
//setImmediate

// 同步代码执行完毕后会立即执行process.nextTick（node官网描述这玩意不属于事件环中的一部分）
// 在浏览器中宏任务队列全局只有一个，但是node中将宏任务也进行了分类（node中是自己实现的事件环libuv）

// 我们关心的node中事件环有三个队列 timers/poll/check.
// 代码走到poll阶段会检测check队列中是否有回调，如果没有就在poll队列中等待，检测是否有新的i/o进来
// 或者定时器到时间
// poll阶段会检测是否有setImmediate，如果有则向下执行，完事了，再回到poll中




//v8引擎是负责解析js语法的，而且可以调用node中的api
//libuv 是需要负责执行node中的API，执行过程还是多线程的，执行完毕后会放到队列中，
// 会开启一个单独的线程来处理

// setTmmediate 和setTimeout执行的时机偶有区别

// 正常来说，eventloop会先执行setTimeout，但执行之前如果定时器的时间还未到，则就会先执行
// setTmmediate。如果时间到了则会执行setTimeout。这个和性能有关