const EventEmitter = require('./events.js');

function Girl(){
	EventEmitter.call(this)
}

Girl.prototype = Object.create(EventEmitter.prototype);

let girl = new Girl();

girl.on('newListener',(eventName)=>{
	console.log(eventName,123)
})

girl.on('hahaha',()=>{
	console.log('haha1')
})
girl.on('hahaha',()=>{
	console.log('haha2')
})
girl.on('hahaha',()=>{
	console.log('haha3')
})

girl.emit('hahaha')







