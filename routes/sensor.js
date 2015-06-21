var dbManager = require('../models/database.js');

var sensor = {

	getAll: function (res, req) {	
		if(!req.clientId) {
    	return res.sendUnauthenticated();
		}
		
		return res.json(dbManager.getAllSensor());
	},

	getOne: function (res, req) {

	},
	
	create: function (res, req) {
		if(!req.clientId) {
			return res.sendUnauthenticated();
		}
		
		if(!req.scopesGranted.indexOf("whatever") === -1) {
			return res.sendUnautorized();
		}
		
		//TODO Do dat create
	}
};

module.exports = sensor;
