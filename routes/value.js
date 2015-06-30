var dbManager = require('../models/database');

var value = {
	
	getMission: function(req, res) {
		if (!req.clientId) {
    	return res.sendUnauthenticated();
		}
		
		data = dbManager.getValues(req.params.mission);
		
		return res.json(data);
	},
	
	addValue: function(req, res) {
		if (!req.clientId) {
			return res.sendUnauthenticated();
		}
		
		//TODO Add Authorization!
		
		var value = {};
		
		value.timestamp = req.body.timestamp;
		value.sensorId = req.body.sensorId;
		value.value = req.body.value;
		
		dbManager.createValue(value, res);
	},
	
	addValueList: function(req, res) {
		if (!req.clientId) {
			return res.sendUnauthenticated();
		}
		
		var valueList = JSON.parse(req.body);
		
		console.log(valueList);
		
		dbManager.createValues(valueList, res);
		
	},
};

module.exports = value; 
