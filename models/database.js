var pg = require('pg');

// Javascript postgre workaround against unix user
pg.defaults.user = 'stratos';
pg.defaults.password = '5trAt0s';

var connectionString =  'postgres://localhost:5432/stratos';

var client = new pg.Client(connectionString);

var manager = {
	
	/*
	 * Create the database tables.
	 */
	initDatabase: function() {
		client.connect();
		var query = client.query("CREATE TABLE IF NOT EXISTS sensor(id SERIAL PRIMARY KEY, description VARCHAR(40) not null, unit VARCHAR(10));	CREATE TABLE IF NOT EXISTS mission(id SERIAL PRIMARY KEY, description VARCHAR(80), start_time TIMESTAMP, end_time TIMESTAMP);");
		query.on('end', function() {client.end();});
	},
	
	/*
	 * Add a new mission to the database
	 */
	createMission: function(mission) {
		client.connect();
		var query = client.query("")
	},
	
	/*
	 * Add a new sensor to the database
	 */
	createSensor: function() {
	
	}
};

module.exports = manager;


