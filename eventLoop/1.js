
new Promise((resolve,reject)=>{
	console.log(111)
	resolve()
}).then(res=>{
	console.log(222)
})

setTimeout(()=>{
	console.log('定时器')
	new Promise((resolve,reject)=>{
		console.log(333)
		resolve()
	}).then(res=>{
		console.log(666)
	})
})