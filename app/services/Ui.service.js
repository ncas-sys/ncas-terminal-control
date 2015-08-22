var moment = require('moment')
var _ = require('underscore');
function UI(events, states, grid, screen, blessed, contrib){
	UI.grid = grid
	UI.events = events
	UI.states = states
	UI.screen = screen
	UI.blessed = blessed
	UI.contrib = contrib
	UI.mainMenuItems = [
				'1. Authorise',
				'2. Dashboard',
				'3. Quick Access',
				'4. Time Sets',
				'5. Emo Power',
				'6. Domes',
				'7. Fans',
				'8. Heaters',
				'9. Extractors',
				'a. Beam Detectors',
				'b. Lighting Scenes',
				'c. Projector',
				'd. About',
				'e. Controllers',
				'f. Nodes',
				'g. Logs'
			]


	UI.events.on('refreshConnections', function(){
		updateConnectionsLists();
	})

	UI.events.on('refreshStates', function(){
		updateStates();
	})

	UI.events.on('addLog', function(log){
		addLog(log)
	})


	UI.centerPosition = null;
	UI.typePosition = null;

}


UI.prototype.init = function(){
	

	UI.controllersTable = UI.grid.set(0,0,35,60, UI.contrib.table,
		{
			keys: true,
			fg: 'white',
			selectedFg: 'white',
			interactive: false,
			label: 'Connected Controllers',
			border: {type: "line", fg: "cyan"},
			columnSpacing: 5,
			columnWidth: [7, 3, 14, 5]
		}
	)
	UI.nodesTable = UI.grid.set(35,0,35,60, UI.contrib.table,
		{
			keys: true,
			fg: 'white',
			selectedFg: 'white',
			interactive: true,
			label: 'Connected Nodes',
			width: 80,
			border: {type: "line", fg: "red"},
			columnSpacing: 5,
			columnWidth: [17, 15],
		}
	)
	
	UI.log = UI.grid.set(70,0,30,60, UI.contrib.log,
		{ 
			fg: "green",
			selectedFg: "green",
			label: 'Activity Log'
		}
	)
	
	UI.statsStatus = UI.grid.set(0,60,25,20, UI.blessed.box,
		{
			label: 'Connection',
			bg: '',
			content: "",
			align: 'center',
			valign: 'middle'
		}
	)

	UI.statsEmo = UI.grid.set(0,80,25,20, UI.blessed.box,
		{
			label: 'Emo',
			bg: '',
			content: "",
			align: 'center',
			valign: 'middle'
		}
	)
	
	UI.statsDomes = UI.grid.set(25,60,25,20, UI.blessed.box,
		{
			label: 'Domes',
			bg: '',
			content: "",
			align: 'center',
			valign: 'middle'
		}
	)
	UI.statsSweeps = UI.grid.set(25,80,25,20, UI.blessed.box,
		{
			label: 'Sweeps',
			bg: '',
			content: "",
			align: 'center',
			valign: 'middle'
		}
	)
	UI.statsHeaters = UI.grid.set(50,80,25,20, UI.blessed.box,
		{
			label: 'Heaters',
			bg: '',
			content: "",
			align: 'center',
			valign: 'middle'
		}
	)
	UI.statsBeams = UI.grid.set(50,60,25,20, UI.blessed.box,
		{
			label: 'Beams',
			bg: '',
			content: "",
			align: 'center',
			valign: 'middle'
		}
	)
	UI.statsExtractors = UI.grid.set(75,80,25,20, UI.blessed.box,
		{
			label: 'Extractors',
			bg: '',
			content: "",
			align: 'center',
			valign: 'middle'
		}
	)
	UI.statsLighting = UI.grid.set(75,60,25,20, UI.blessed.box,
		{
			label: 'Lighting',
			bg: '',
			content: "",
			align: 'center',
			valign: 'middle'
		}
	)



	UI.screen.render()
	UI.screen.key(['escape', 'q', 'C-c'], function(ch, key) {
		return process.exit(0);
	});
	
}


addLog = function(log){
	var date = new moment().format('HH:mm:ss ddd Do MMM')
	UI.log.log(date)
	UI.log.log('	' + log)
}

updateConnectionsLists = function(){
	var connections = UI.states.getConnections();
	var controllers = [];
	var nodes = [];
	for (var key in connections) {
		if(connections[key]!=null){
			var obj = []
			obj.push(connections[key].name)
			if(connections[key].type=='controller'){
				obj.push(connections[key].locale[0].toUpperCase())
				obj.push(connections[key].ip)
				obj.push(connections[key].auth)
				controllers.push(obj)
			}else{
				if(connections[key].ip){
					obj.push(connections[key].ip)
				}
				nodes.push(obj)
			}
		}
	}
	UI.controllersTable.setData({
		headers: ['Name', 'Locale', 'IP', 'Auth'],
		data:controllers
	})
	UI.nodesTable.setData({
		headers: ['Name', 'IP'],
		data:nodes
	})
	UI.screen.render()
}
updateStates = function(obj){
	var states = UI.states.getStates();
	for (var key in states) {
		var value = states[key]
		var statBox = null;
		var color = null;
		if(key=='connection'){
			statBox = UI.statsStatus
		}else if(key=='auditTemp'){
			statBox = UI.statsTemp
		}else if(key=='domes'){
			statBox = UI.statsDomes
		}else if(key=='sweeps'){
			statBox = UI.statsSweeps
		}else if(key=='emo'){
			statBox = UI.statsEmo
		}else if(key=='heaters'){
			statBox = UI.statsHeaters
		}else if(key=='beams'){
			statBox = UI.statsBeams
		}else if(key=='projectorPower'){
			statBox = UI.statsProjectorPower
		}else if(key=='projectorShutter'){
			statBox = UI.statsProjectorShutter
		}else if(key=='extractors'){
			statBox = UI.statsExtractors
		}else if(key=='lightingScene'){
			statBox = UI.statsLighting
		}
		if(key=='connection'){
			//custom options for connection
			if(value=='connected'){
				color=2
			}else if(value=='offline'){
				color=1
			}else if(value=='detached'){
				color=8
			}
			if(value!=null){
				var text = value.toString()
				statBox.content = value;
				statBox.style.bg = color;
			}
		}else{
			if(value=='On' || value=='on' || value==1){
				color=2
			}else if(value=='Off' || value=='off' || value==0){
				color=1
			}else{
				color=4
			}
			if(statBox!=null && color!=null){
				statBox.style.bg = color;
			}
			if(statBox!=null && value!=null){
			//	console.log(value);
				if(value==0){
					value = 'Off';
				}else if(value==1){
					value = 'On';
				}
				statBox.content = String(value);
			}
		}
	}
	UI.screen.render();
}




module.exports = function(events, states, grid, screen, blessed, contrib){
	return new UI(events, states, grid, screen, blessed, contrib)
}