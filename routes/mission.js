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
		
	}
};

module.exports = mission;
