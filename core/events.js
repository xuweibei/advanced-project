function EventEmitter(){
	this._events = {};
}

EventEmitter.prototype.on = function(eventName,fn){
	if(!this._events) this._events = {};
	if(eventName !== 'newListener'){
		this.emit('newListener',eventName)
	}
	(this._events[eventName] || (this._events[eventName] = [])).push(fn)
}

EventEmitter.prototype.once = function(eventName,fn){
	if(!this._events) this._events = {};
	const once = ()=>{
		fn();
		this.off(eventName,once)
	}
	once.l = fn;
	this.on(eventName,once)
}
EventEmitter.prototype.off = function(eventName,fn){
	if(!this._events) this._events = {};
	let eventList = this._events[eventName];
	if(eventList){
		this._events[eventName]=eventList.filter(item=>item!=fn && this.once.l !=fn)
	}
}

EventEmitter.prototype.emit = function (eventName,...args){
	if(!this._events) this._events = {};
	this._events[eventName] && this._events[eventName].forEach(item=>item(...args))
}



module.exports = EventEmitter