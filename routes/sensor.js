var dbManager = require('../models/database.js');

var sensor = {

	getAll: function (req, res) {
	
		if (!req.clientId) {
    	return res.sendUnauthenticated();
		}

		dbManager.getAllSensor(res);
	},

	getOne: function (req, res) {

	},
	
	create: function (req, res) {
		if(!req.clientId) {
			return res.sendUnauthenticated();
		}
	}
};

module.exports = sensor;
