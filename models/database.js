var pg = require('pg');
var config = require('../options.js');

pg.defaults.user = config.storageConfig.database.user;
pg.defaults.password = config.storageConfig.database.pass;

var connectionString =  config.storageConfig.database.url;

var client = new pg.Client(connectionString);
client.connect();

client.on('err', function(error) {
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
			'CREATE TABLE IF NOT EXISTS producer (' +
				'id SERIAL PRIMARY KEY,' +
				'name VARCHAR(20),' +
				'description VARCHAR(80)' +
			');'+
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
			');'
		);
	},
	
	/*
	 * Add a new mission to the database
	 */
	createMission: function(mission, res) {
	
		//TODO Check for active missions !!!
		
		var query = client.query(
			'INSERT INTO mission (description, start_time, end_time) VALUES ($1, $2, $3);', 
			[mission.description, mission.start_time, mission.end_time]
		);
		
		query.on('error', function(error) {
			res.status(500);
		});
		
		query.on('end', function() {
			return res.json(mission);
		});
	},
	
	/*
	 * Add a value to the database.
	 */
	createValue: function(value, res) {
		var query = client.query (
			'INSERT INTO value (timestamp, sensor_id, value) VALUES ($1, $2, $3);',
			[value.timestamp, value.sensorId, value.value]
		);
		
		query.on('error', function(error) {
			console.log(error);
			res.status(500).send(error);
		});
		
		query.on('end', function() {
			res.json(value);
		});	
	},
	
	createValues: function(valueList, res) {
		
		async.eachLimit (valueList, 4, function(row) {
			var query = client.query (
				'INSERT INTO value (timestamp, sensor_id, value) VALUES ($1, $2, $3);',
				[row.timestamp, row.sensorId, row.value]
			);
			
			query.on('error', function(error) {
				console.log(error);
			});
			
			query.on('end', function() {
				console.log('ready');
			});
		}, function(err, res) {
			res.status(200);
		});
			
		}
	},
	
	/*
	 *
	 */
	 createValueList: function(valuelist, res) {
	 
	 },
	
	/*
	 * Add a new sensor to the database
	 */
	createSensor: function(sensor) {
		var query = client.query(
			'INSERT INTO sensor (producer, name, description, unit) VALUES ($1, $2, $3, $4);',
			[sensor.producer, sensor.sensorname, sensor.description, sensor.unit]
		);
	},
	
	createProducer: function(producer) {
		var query = client.query (
			'INSERT INTO producer (name, description) VALUES ($1, $2);',
			[producer.producer_name, producer.description]
		);
	},
	
	/*
	 * Create a new user 
	 */
	createUser: function (user) {
		
	},
	
	/*
	 * Return all missions in the database
	 */
	getAllMission: function (res) {
		var results = [];
		var query = client.query('SELECT * FROM mission;');
		
		query.on('row', function(row) {
			results.push(row);
		});
		
		query.on('end', function() {
			console.log("Result Array: " + results);
			res.json(results | "No active mission");
		});
	},
	
	/*
	 * Return the active mission. A mission is active, if the start_time but 
	 * not the end_time is set.
	 * There sould only be one active mission in the database. If there is
	 * more than one active mission, the server respond with an error message.
	 */
	getActiveMission: function (res) {
		var results = [];
		var query = client.query('SELECT * FROM mission WHERE end_time IS NULL;');
		
		query.on('row', function(row) {
			results.push(row);
		});
		
		query.on('end', function() {
			if(results.length > 2) {
				console.log('More than 2 active missions');
				res.status(500).send('There is more than one active mission');	
			}
			
			res.json(results[0]);
		});
	},
	
	/*
	 * Return all sensors in the database
	 */
	getAllSensor: function (res) {
		var results = [];
		var query = client.query('SELECT * FROM sensor;');
		
		query.on('row', function(row) {
			results.push(row);
		});
		
		query.on('end', function() {
			console.log("Sensor: " + results);
			res.json(results);
		});
	},
	
	getLastValues: function(res) {
		var results = [];
		var query = client.query('SELECT * FROM value WHERE timestamp = (select max(timestamp) from sensor)');
		
		query.on('row', function(row) {
			results.push (row);
		});
		
		query.on('end', function(row) {
			res.json(results);
		});
	},
	
	/*
	 * 
	 */	
	getValues: function(missionId, res) {
		var mission = getMission(mission);
		var results = [];
		
		if (mission.end_time != null) {
			var query = client.query('SELECT * FROM value WHERE timestamp BETWEEN ' +
				mission.start_time + 
				' AND ' + 
				mission.end_time +
				';');
		} else {
			var query = client.query('SELECT * FROM value WHERE timestamp BETWEEN ' +
				mission.start_time +
				'AND' +
				'now()::timestamp;'
				);
		}
		
		query.on('row', function(row) {
			results.push(row);
		});
		
		query.on('end', function() {
			res.json(results);
		});
	}
};

module.exports = manager;
