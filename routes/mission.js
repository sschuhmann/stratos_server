var dbManager = require('../models/database');

var mission = {

	getAll:  function(req, res) {
		if (!req.clientId) {
    	return res.sendUnauthenticated();
		}
		
		data = dbManager.getAllMission();
		return res.json(data));
		
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
