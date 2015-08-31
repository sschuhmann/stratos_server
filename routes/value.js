var dbManager = require('../models/database');

var value = {
	
	getMission: function(req, res) {
		if (!req.clientId) {
    	return res.sendUnauthenticated();
		}
		
		dbManager.getValues(req.params.mission, res);
	},
	
	getValueSensorMission: function(req, res) {
		if (!req.clientId) {
			return res.sendUnauthenticated();
		}
		
		dbManager.getValueSensorMission(req.params.mission, req.params.sensor, res);
	},
	
	getLastValues: function (req, res) {
		if(!req.clientId) {
			return res.sendUnauthenticated();
		}
		
		dbManager.getLastValues(res);
	},
	
	getLastValueSensor: function(req, res) {
		if(!req.clientId) {
			return res.sendUnauthenticated();
		}
		
		var string = '';
		
		for (var p in req.params.sensor_id) {
			string += p + ', '
		}
		
		string = string.substring(0, string.length - 2);
		
		console.log(string)   
		
		dbManager.getLastValueSensor(string, res);
	},
	
	addValue: function(req, res) {
		if (!req.clientId) {
			return res.sendUnauthenticated();
		}
		
//		if (req.scopesGranted.indexOf("create_value") === -1) {
//			return res.sendUnauthorized();
//		}
		
		try {
			var value = JSON.parse(req.body);
			
			dbManager.createValue(value, res);
		} catch (err) {
			console.log(err);
			res.status(500).send(err);
		}
	},
	
	addValueList: function(req, res) {
		if (!req.clientId) {
			return res.sendUnauthenticated();
		}
		
//		if (req.scopesGranted.indexOf("create_value") === -1) {
//			return res.sendUnauthorized();
//		}
		
		try {
			var valueList = JSON.parse(req.body);
		
			console.log(valueList);
		
			dbManager.createValues(valueList, res);
		} catch (err) {
			console.log(err);
			res.status(500).send(err);
		}
		
	},
};

module.exports = value; 
