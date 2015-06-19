var pg = require('pg');
var connectionString = 'postgres://localhost:5432/stratos';

var mission = {

	getAll:  function(req, res) {
		if (!req.clientId) {
    	return res.sendUnauthenticated();
		}
		
		pg.connect(connectionString);
		
	  res.json({
			id: 'abc123',
	  	name : 'Testmission',
	  	start: 12324345,
	  	end: 34435456,
	  	desc: 'Hallo welt'
	  });
	},
	
	getOne: function(req, res) {
		if (!req.clientId) {
    	return res.sendUnauthenticated();
		}
		
		if (req.scopesGranted.indexOf("two") === -1) {
			return res.sendUnauthorized();
		}	
		
		res.json({
			id: 'abc123',
	  	name : 'Testmission',
	  	start: 12324345,
	  	end: 34435456,
	  	desc: 'Hallo welt'
	  });
	}
};

module.exports = mission;
