var dbManager = require('../models/database');

var mission = {

	getAll: function(req, res) {
		if (!req.clientId) {
    	return res.sendUnauthenticated();
		}
		
		console.log('Accessing database');
		dbManager.getAllMission(res);
	},
	
	getOne: function(req, res) {
		if (!req.clientId) {
    	return res.sendUnauthenticated();
		}
		
		dbManager.getOne(req.params.missionid, res);
	},
	
	getActiveMission: function(req, res) {
		if(!req.clientId) {
			return res.sendUnauthenticated();
		}
		
		dbManager.getActiveMission(res);
	},
	
	create: function(req, res) {
		if (!req.clientId) {
			return res.sendUnauthenticated();
		}
		
		var data = {};
		
		console.log(req);
		
		data.description = req.body.description;
		data.start_time = req.body.start_time;
		data.end_time = req.body.end_time;
		
		console.log(data);
		
		dbManager.createMission(data, res);
	}
};

module.exports = mission;
