var pg = require('pg');

// Javascript postgre workaround against unix user
pg.defaults.user = 'stratos';
pg.defaults.password = null;

var connectionString = process.env.DATABASE_URL | 'postgres://localhost:5432/stratos';

var client = new pg.Client(connectionString);

var manager = {
	
	/*
	 * Create the database tables.
	 */
	initDatabase: function() {
		client.connect();
		var query = client.query("CREATE TABLE IF NOT EXIST sensor(id SERIAL PRIMARY KEY, description VARCHAR(40) not null, unit VARCHAR(10));	CREATE TABLE IF NOT EXIST mission(id SERIAL PRIMARY KEY, description VARCHAR(80), start_time TIMESTAMP, end_time TIMESTAMP);");
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


