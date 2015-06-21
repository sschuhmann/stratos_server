var pg = require('pg');
var config = require('../options.js');

pg.defaults.user = config.storageConfig.database.user;
pg.defaults.password = config.storageConfig.database.pass;

var connectionString =  config.storageConfig.database.url;

var client = new pg.Client(connectionString);
client.connect();

client.on('error', function(error) {
	console.log(error);
	process.exit(-1);
});

var manager = {
	
	/*
	 * Create the database tables.
	 */
	initDatabase: function() {
		var query = client.query("CREATE TABLE IF NOT EXISTS sensor(id SERIAL PRIMARY KEY, description VARCHAR(40) not null, unit VARCHAR(10));	CREATE TABLE IF NOT EXISTS mission(id SERIAL PRIMARY KEY, description VARCHAR(80), start_time TIMESTAMP, end_time TIMESTAMP);");
		query.on ('error', function(error) {
			console.log(error);
		});
	},
	
	/*
	 * Add a new mission to the database
	 */
	createMission: function(mission) {
		var query = client.query('INSERT INTO mission VALUES ($1, $2, $3);', [mission.description, mission.start_time, mission.end_time]);
		
		query.on('err', function(error) {
			console.log(error);
		});
	},
	
	/*
	 * Add a new sensor to the database
	 */
	createSensor: function(sensor) {
	
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
		var results = [];
		var query = client.query('SELECT * FROM sensor;');
		
		query.on('row', function(row) {
			results.push(row);
		});
		
		query.on('end', function() {
			return results;
		});
	}
};

module.exports = manager;
