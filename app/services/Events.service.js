function Events(){
	Events.events = {}

}

Events.prototype.on = function(name, callback){

	if(typeof Events.events[name] == 'undefined'){
		Events.events[name] = []
		Events.events[name].push(callback)
	}else{
		Events.events[name].push(callback)
	}

}

Events.prototype.emit = function(name, obj){
	if(typeof obj=='undefined' || !obj){
		obj = null;
	}
	if(typeof Events.events[name] == 'object'){
		//we have some options

		for (var key in Events.events[name]) {
			if(typeof Events.events[name][key] == 'function'){
				Events.events[name][key](obj)
			}
		}

	}
}


module.exports = function(){
	return new Events()
}