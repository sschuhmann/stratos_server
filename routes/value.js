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
