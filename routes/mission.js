var dbManager = require('../models/database');

var mission = {

	getAll:  function(req, res) {
		if (!req.clientId) {
    	return res.sendUnauthenticated();
		}
		console.log('Accessing database');
		data = dbManager.getAllMission();
		console.log('Data: ' + data);
		res.contentType = "application/hal+json";
		return res.send(data);
	},
	
	getOne: function(req, res) {
		if (!req.clientId) {
    	return res.sendUnauthenticated();
		}
		
		if (req.scopesGranted.indexOf("two") === -1) {
			return res.sendUnauthorized();
		}	
	},
	
	create: function(req, res) {
		if (!req.clientId) {
			return res.sendUnauthenticated();
		}
		
		var data = {};
		
		data.description = req.body.description;
		data.start_time = req.body.start_time;
		data.end_time = req.body.end_time;
		
		dbManager.createMission();
	}
};

module.exports = mission;
