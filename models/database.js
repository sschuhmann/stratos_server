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

	errorHandler: function(error) {
		console.log(error);
	},
	
	/*
	 * Create the database tables.
	 */
	initDatabase: function() {
		var query = client.query(
			'CREATE TABLE IF NOT EXISTS sensor(' +
				'id SERIAL PRIMARY KEY, '+
				'producer INTEGER references producer(id), ' +
				'name VARCHAR(20) not null, ' +
				'description VARCHAR(40), ' +
				'unit VARCHAR(10)' +
			');' +
			'CREATE TABLE IF NOT EXISTS mission(' +
				'id SERIAL PRIMARY KEY, '+ 
				'description VARCHAR(80), ' +
				'start_time TIMESTAMP, ' +
				'end_time TIMESTAMP'+
			');' +
			'CREATE TABLE IF NOT EXISTS value(' +
				'timestamp TIMESTAMP, ' +
				'sensor_id INTEGER references sensor(id), ' +
				'value decimal' +
			');' +
			'CREATE TABLE IF NOT EXISTS producer (' +
				'id SERIAL PRIMARY KEY,' +
				'name VARCHAR(20),' +
				'description VARCHAR(80)' +
			');'
		);
		
		query.on ('error', errorHandler(error));
	},
	
	/*
	 * Add a new mission to the database
	 */
	createMission: function(mission) {
		var query = client.query(
			'INSERT INTO mission VALUES ($1, $2, $3);', 
			[mission.description, mission.start_time, mission.end_time]
		);
		
		query.on('err', errorHandler(error));
	},
	
	createValue: function(value) {
		var query = client.query (
			'INSERT INTO value ($0, $1, $2);',
			[value.timestamp, value.sensor_id, value.value]
		);
		
		query.on('err', errorHandler(error));
	},
	
	/*
	 * Add a new sensor to the database
	 */
	createSensor: function(sensor) {
		var query = client.query(
			'INSERT INTO sensor VALUES ($1, $2, $3, $4);',
			[sensor.producer, sensor.sensorname, sensor.description, sensor.unit]
		);
		
		query.on('err', errorHandler(error));
	},
	
	createProducer: function(producer) {
		var query = client.query (
			'INSERT INTO producer VALUES ($1, $2);',
			[producer.producer_name, producer.description]
		);
		
		query.on('err', errorHandler(error));
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
		
		query.on('err', errorHandler(error));
		
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
		
		query.on('err', errorHandler(error));
	},
	
	/*
	 *
	 */	
	getValues: function(missionId) {

	}
};

module.exports = manager;
