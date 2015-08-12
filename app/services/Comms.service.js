function Comms(socket, events, states){
	Comms.socket = socket;
	Comms.events = events;
	Comms.states = states
	Comms.states.resetConnections();
	readyToConnect();

	events.on('authAttempt', function(val){
		socket.emit('AuthAttempt', val)
	})

}

readyToConnect = function(){
	Comms.socket.on('connect', function(){
		var stateObj = {
			state: 'connection',
			value: 'Read Only'
		}
		Comms.states.updateState(stateObj)
		
		Comms.states.resetConnections();
		var obj = {
			name: 'Terminal Controller',
			type: 'controller',
			locale: 'internal'
		}
		Comms.socket.emit('Register', obj)
		
	});
	Comms.socket.on('Welcome', function(obj){
		Comms.states.resetConnections();
		Comms.socket.emit('GiveMeEverything')
	})
	Comms.socket.on('NewConnection', function(obj){
		Comms.states.addConnection(obj);
		var log = '';
		if(obj.type=='controller'){
			log = 'Controller connected: ' + obj.name + ' @ ' + obj.locale;
		}else{
			log = 'Node connected: ' + obj.name;
		}
		Comms.events.emit('addLog', log)
	})
	Comms.socket.on('ConnectionGone', function(connectId){
		Comms.states.removeConnection(connectId);
		var log = 'Connection to a node was lost ' + connectId;
		Comms.events.emit('addLog', log)
	})
	Comms.socket.on('UpdateState', function(obj){
		Comms.states.updateState(obj);
		var log = 'State for ' + obj.state + ' was updated to ' + obj.value;
		Comms.events.emit('addLog', log)
	})
}

module.exports = function(socket, events, states){
	new Comms(socket, events, states)
}