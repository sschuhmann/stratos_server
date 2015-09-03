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
	
	getForecast: function (req, res) {
		if(!req.clientId) {
			return res.sendUnauthenticated();
		}
		
		dbManager.getForecast(req.params.mission, res);
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
		
		console.log(req.params);
		console.log(req.params.sensor_id);
		
		var string = '';
		
		for (var p in req.params.sensor_id) {
			string += req.params.sensor_id[p] + ', '
		}
		
		string = string.substring(0, string.length - 2);
		taxi
		console.log(string)
		
		dbManager.getLastValueSensor(string, res);
	},
	
	getLastValuesFrom: function(req, res) {
		if(!req.clientId) {
			return res.sendUnauthenticated();
		}
		
		if(!req.params.start_time == undefined) {
		
			if (req.params.sensor_id == undefined) {	
				//Gonna catch'em all
				dbManager.getValuesFrom(req.params.start_time, res);
			} else {
				var string = '';
				for (var p in req.params.sensor_id) {
					string += req.params.sensor_id[p] + ', ';
				}
				string = string.substring(0, string.length - 2);
				dbManager.getValuesFrom(req.params.start_time[0], string, res);
			}
		} else {
			res.json();
		}
	},
	
	addValue: function(req, res) {
		if (!req.clientId) {
			return res.sendUnauthenticated();
		}
		
//		if (req.scopesGranted.indexOf("create_value") === -1) {
//			return res.sendUnauthorized();
//		}
		
		try {
			console.log(req.body);
			//var value = JSON.parse(req.body);
			
			dbManager.createValue(req.body, res);
		} catch (err) {
			console.log(err);
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
			//var valueList = JSON.parse(req.body);
		
//			console.log(valueList);
		
			dbManager.createValues(req.body, res);
		} catch (err) {
			console.log(err);
		}
		
	},
};

module.exports = value; 
