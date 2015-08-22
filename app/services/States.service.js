function States(events, screen){
	States.connections = {}
	States.events = events
	States.screen = screen;
	States.states = {
		connection: null,
		auditTemp: null,
		domes: null,
		sweeps: null,
		emo: null,
		heaters: null,
		beams: null,
		projectorPower: null,
		projectorShutter: null,
		extractors: null,
		lightingScene: null
	}
}
States.prototype.resetConnections = function(){
	States.connections = {}
	States.events.emit('refreshConnections')
}

States.prototype.updateState = function(obj){
	States.states[obj.node] = obj.value;
	States.events.emit('refreshStates')
}

States.prototype.wipeStates = function(){
	States.states = {
		connection: null,
		auditTemp: null,
		domes: null,
		sweeps: null,
		emo: null,
		heaters: null,
		beams: null,
		projectorPower: null,
		projectorShutter: null,
		extractors: null,
		lightingScene: null
	}
	States.events.emit('refreshStates');
}



States.prototype.addConnection = function(connection){
	States.connections[connection.id] = connection
	States.events.emit('refreshConnections')
}
States.prototype.removeConnection = function(id){
	for (var key in States.connections) {
		if(key==id){
			States.connections[id] = null;
		}
	}

	setTimeout(function(){
		States.events.emit('refreshConnections')
	}, 200);
}


States.prototype.getConnections = function(){
	return States.connections;
}
States.prototype.getStates = function(){
	return States.states;
}


module.exports = function(events, screen){
	return new States(events, screen)
}