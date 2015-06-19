var pg = require('pg');
var connectionString = process.env.DATABASE_URL | 'postgres://localhost:5432/stratos';

var client = new pg.Client(connectionString);

var manager = {
	
	/*
	 * Create the database tables.
	 */
	initDatabase: function() {
		client.connect();
		var query = client.query('CREATE TABLE sensor(id SERIAL PRIMARY KEY, description VARCHAR(40) not null, unit VARCHAR(10))');
		query.on('end', function() {client.end();});
	},
	
	/*
	 * Add a new mission to the database
	 */
	createMission: function(mission) {
		client.connect();
		
	},
	
	/*
	 * Add a new sensor to the database
	 */
	createSensor: function() {
	
	}
};

module.exports = manager;


