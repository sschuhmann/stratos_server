var dbManager = require('../models/database');

var mission = {

	getAll: function(req, res) {
		if (!req.clientId) {
    	return res.sendUnauthenticated();
		}
		
		console.log('Accessing database');
		data = dbManager.getAllMission(res);
	},
	
	getOne: function(req, res) {
		if (!req.clientId) {
    	return res.sendUnauthenticated();
		}
		
		data = dbManager.getOne(req.params.missionid, res);
	},
	
	create: function(req, res) {
		if (!req.clientId) {
			return res.sendUnauthenticated();
		}
		
//		if (req.scopesGranted.indexOf("whatever") === -1) {
//			return res.sendUnauthorized();
//		}
		
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
