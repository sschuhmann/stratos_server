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
		//query.on('end', function() {client.done();});
	},
	
	/*
	 * Add a new mission to the database
	 */
	createMission: function(mission) {

	},
	
	/*
	 * Add a new sensor to the database
	 */
	createSensor: function() {
	
	},
	
	/*
	 * Create a new user 
	 */
	createUser: function (user) {
	
	},
	
	/*
	 * Return all missions in the database
	 */
	getAllMission: function () {
		var results = [];
		
		var query = client.query('SELECT * FROM mission;');
		
		query.on('row', function(row) {
			results.push(row);
			console.log(row);
		});
		
		query.on('end', function() {
		//	client.done();
			console.log(results);
			return results;
		});
	},
	
	/*
	 * Return all sensors in the database
	 */
	getAllSensor: function () {
		client.connect();
		var results = [];
		var query = client.query('SELECT * FROM sensor;');
		
		query.on('row', function(row) {
			results.push(row);
		});
		
		query.on('end', function() {
			client.end();
			return results;
		});
	}
};

module.exports = manager;


