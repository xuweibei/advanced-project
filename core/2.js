setTimeout(function() {
	console.log('2');
	process.nextTick(function() {
			console.log('3');
	})
	new Promise(function(resolve) {
			console.log('4');
			resolve();
	}).then(function() {
			console.log('5')
	})
})

setTimeout(function() {
	console.log('9');
	process.nextTick(function() {
			console.log('10');
	})
	new Promise(function(resolve) {
			console.log('11');
			resolve();
	}).then(function() {
			console.log('12')
	})
})