function States(events){
	States.connections = {}
	States.events = events
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
}

States.prototype.updateState = function(obj){
	States.states[obj.node] = obj.value;
	States.events.emit('refreshStates')
}



States.prototype.addConnection = function(connection){
	States.connections[connection.id] = connection
	States.events.emit('refreshConnections')
}
States.prototype.removeConnection = function(id){
	delete States.connections[id]
	States.events.emit('refreshConnections')
}


States.prototype.getConnections = function(){
	return States.connections;
}
States.prototype.getStates = function(){
	return States.states;
}


module.exports = function(events){
	return new States(events)
}