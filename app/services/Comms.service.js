function Comms(socket, events, states){
	Comms.socket = socket;
	Comms.events = events;
	Comms.states = states
	Comms.states.resetConnections();
	readyToConnect();
}

readyToConnect = function(){
	Comms.socket.on('connect', function(){
		Comms.states.updateState({
			node: 'connection',
			value: 'detached'
		});
		var obj = {
			request: 'register',
			name: 'Terminal Controller',
			type: 'controller',
			locale: 'internal'
		}
		Comms.states.resetConnections();
		Comms.socket.emit('Register', obj);
	});



	Comms.socket.on('WelcomeController', function(id){
		Comms.states.updateState({
			node: 'connection',
			value: 'connected'
		});
		Comms.socket.emit('ToMaster', {
			event: 'GiveMeEverything'
		})
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
		var log = 'State for ' + obj.node + ' was updated to ' + obj.value;
		Comms.events.emit('addLog', log)
	})



	Comms.socket.on('disconnect', function(){
		//loose all data please
		Comms.states.resetConnections();
		Comms.states.wipeStates()
		Comms.states.updateState({
			node: 'connection',
			value: 'offline'
		});
	})

	//this will only come from the external server if this is an external connection
	Comms.socket.on('MasterConnectionLost', function(){
		//loose all data please
		Comms.states.resetConnections();
		Comms.states.wipeStates()
		Comms.states.updateState({
			node: 'connection',
			value: 'detached'
		});
	})
}

module.exports = function(socket, events, states){
	new Comms(socket, events, states)
}