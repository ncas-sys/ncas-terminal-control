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
	UI.titleBox = UI.grid.set(0,0,10,100, UI.blessed.box,
		{
			content: '~ nCAS ~',
			border: {type: "line", fg: "red"},
			bg: 4,
			fg: 'white',
			align: 'center',
			valign: 'middle'
		}
	)
	UI.menuTable = UI.grid.set(10,0,30,30, UI.blessed.list,
		{
			keys: true,
			fg: 'white',
			style: {
				selected: {
					fg: 1
				}
			},
			interactive: true,
			label: 'Main Menu',
			border: {type: "line", fg: "cyan"},
			items:UI.mainMenuItems
		}
	)

	UI.menuTable.key('enter', function(val1, val2, val3){
		MainMenuItemSelect(UI.menuTable.selected);
	})
	UI.menuTable.key(['1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g'], function(val1, val2, val3){
		var menus = {
			'1': 0,
			'2': 1,
			'3': 2,
			'4': 3,
			'5': 4,
			'6': 5,
			'7': 6,
			'8': 7,
			'9': 8,
			'a': 9,
			'b': 10,
			'c': 11,
			'd': 12,
			'e': 13,
			'f': 14,
			'8': 15,
		}
		UI.menuTable.select(menus[val1])
	})
	


	UI.controllersTable = UI.grid.set(41,0,30,30, UI.contrib.table,
		{
			keys: true,
			fg: 'white',
			selectedFg: 'white',
			interactive: true,
			label: 'Connected Controllers',
			border: {type: "line", fg: "cyan"},
			columnSpacing: 5,
			columnWidth: [2, 15, 3, 9, 5]
		}
	)
	UI.nodesTable = UI.grid.set(71,0,30,30, UI.contrib.table,
		{
			keys: true,
			fg: 'white',
			selectedFg: 'white',
			interactive: true,
			label: 'Connected Nodes',
			width: 80,
			border: {type: "line", fg: "red"},
			columnSpacing: 5,
			columnWidth: [2, 15, 15],
		}
	)

	UI.log = UI.grid.set(80,31,20,69, UI.contrib.log,
		{ 
			fg: "green",
			selectedFg: "green",
			label: 'Activity Log'
		}
	)


	UI.statsStatus = UI.grid.set(10,80,10,10, UI.blessed.box,
		{
			label: 'Connection',
			bg: '',
			content: '',
			align: 'center',
			valign: 'middle'
		}
	)

	UI.statsTemp = UI.grid.set(10,90,10,10, UI.blessed.box,
		{
			label: 'Auditorium Temp',
			bg: '',
			content: '',
			align: 'center',
			valign: 'middle'
		}
	)
	UI.statsDomes = UI.grid.set(22,80,10,10, UI.blessed.box,
		{
			label: 'Domes',
			bg: '',
			content: '',
			align: 'center',
			valign: 'middle'
		}
	)
	UI.statsSweeps = UI.grid.set(22,90,10,10, UI.blessed.box,
		{
			label: 'Sweeps',
			bg: '',
			content: '',
			align: 'center',
			valign: 'middle'
		}
	)
	UI.statsEmo = UI.grid.set(34,80,10,10, UI.blessed.box,
		{
			label: 'Emo',
			bg: '',
			content: '',
			align: 'center',
			valign: 'middle'
		}
	)
	UI.statsHeaters = UI.grid.set(34,90,10,10, UI.blessed.box,
		{
			label: 'Heaters',
			bg: '',
			content: '',
			align: 'center',
			valign: 'middle'
		}
	)
	UI.statsBeams = UI.grid.set(46,80,10,10, UI.blessed.box,
		{
			label: 'Beams',
			bg: '',
			content: '',
			align: 'center',
			valign: 'middle'
		}
	)
	UI.statsProjectorPower = UI.grid.set(46,90,10,10, UI.blessed.box,
		{
			label: 'Extractors',
			bg: '',
			content: '',
			align: 'center',
			valign: 'middle'
		}
	)
	UI.statsProjectorShutter = UI.grid.set(58,80,10,10, UI.blessed.box,
		{
			label: 'Pro-Shutter',
			bg: '',
			content: '',
			align: 'center',
			valign: 'middle'
		}
	)
	UI.statsExtractors = UI.grid.set(58,90,10,10, UI.blessed.box,
		{
			label: 'Pro-Power',
			bg: '',
			content: '',
			align: 'center',
			valign: 'middle'
		}
	)
	UI.statsLighting = UI.grid.set(70,80,10,10, UI.blessed.box,
		{
			label: 'Lighting',
			bg: '',
			content: '',
			align: 'center',
			valign: 'middle'
		}
	)
	UI.statsDoing = UI.grid.set(70,90,10,10, UI.blessed.box,
		{
			content: 'all done',
			align: 'center',
			valign: 'middle'
		}
	)



	UI.screen.render()
	UI.screen.key(['escape', 'q', 'C-c'], function(ch, key) {
		return process.exit(0);
	});
	UI.screen.key(['m'], function(ch, key) {
		UI.menuTable.focus()
	});

	UI.screen.key(['c'], function(ch, key) {
		UI.controllersTable.focus()
	});

	UI.screen.key(['n'], function(ch, key) {
		UI.nodesTable.focus()
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
		var obj = []
		obj.push(key)
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
	UI.controllersTable.setData({
		headers: ['ID', 'Name', 'Locale', 'IP', 'Auth'],
		data:controllers
	})
	UI.nodesTable.setData({
		headers: ['ID', 'Name', 'IP'],
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
		if(value=='On' || value=='on' || value==1){
			color=2
		}else if(value=='Off' || value=='off' || value==0){
			color=1
		}else{
			color=3
		}
		if(statBox!=null && color!=null){
			statBox.style.bg = color;
		}
		if(statBox!=null && value!=null){
		//	console.log(value);
		//	statBox.content = value;
		}
	}
	UI.screen.render();
}


MainMenuItemSelect = function(item){
	if(UI.centerPosition!=null){
		UI.centerPosition.destroy();
	}
	if(UI.typePosition!=null){
		UI.typePosition.destroy();
	}
	switch(item) {
		case 0:
			//authorise
			CenterUI.authorise()
			break;
		default:
			//nothing to do
	}
}

var CenterUI = {
	authorise: function(){
		UI.typePosition = UI.grid.set(10,30,6,50, UI.blessed.textbox,
			{
				label: 'Authorise Session',
				censor: true,
				secret: false,
				inputOnFocus: true,
			}
		)
		UI.typePosition.key('enter', function(){
			var val = _.clone(UI.typePosition.value);
			UI.events.emit('authAttempt', val)
			UI.typePosition.destroy();
			UI.typePosition = null;
			UI.statsDoing.content = 'authing...'
			UI.screen.render();
		})
		UI.typePosition.focus();
		UI.screen.render();
	}

}





module.exports = function(events, states, grid, screen, blessed, contrib){
	return new UI(events, states, grid, screen, blessed, contrib)
}