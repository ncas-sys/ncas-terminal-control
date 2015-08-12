var blessed = require('blessed'),
	contrib = require('blessed-contrib'),
	screen = blessed.screen(),
	socket = require('socket.io-client')('http://192.168.20.2:5656'),
	grid = new contrib.grid({rows: 100, cols: 100, screen: screen}),
	events = require('./app/services/Events.service')(),
	states = require('./app/services/States.service')(events)

	comms = require('./app/services/Comms.service')(socket, events, states)

	ui = require('./app/services/Ui.service')(events, states, grid, screen, blessed, contrib)
	ui.init();