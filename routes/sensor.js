var dbManager = require('../models/database.js');

var sensor = {

	getAll: function (req, res) {
		console.log('Requesting data');
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
