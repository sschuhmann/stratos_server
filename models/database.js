var pg = require('pg');
var config = require('../options.js');
var async = require('async');

/* Postgres driver timestamp conversion fix*/
var types = require('pg').types;
var timestampOID = 1114;
types.setTypeParser(1114, function(stringValue) {
  return stringValue;
})

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
				'value decimal,' +
				'constraint ucs unique (timestamp, sensor_id)'+
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
			res.send(200);
		});
		
		res.send(200);
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
		var query = client.query('SELECT * FROM mission ORDER BY id;');
		
		query.on('row', function(row) {
			results.push(row);
		});
		
		query.on('end', function() {
			console.log("Result Array: " + results);
			res.json(results);
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
		var query = client.query('SELECT * FROM sensor ORDER BY id;');
		
		query.on('row', function(row) {
			results.push(row);
		});
		
		query.on('end', function() {
			console.log("Sensor: " + results);
			res.json(results);
		});
	},
	
	/*
	 * Get last values of the active mission.
	 */
	getLastValues: function(res) {
		var results = [];
		//TODO check if there is an active mission
		var query = client.query('select * from value where timestamp = (select max(timestamp) from value) ORDER BY sensor_id;');
		
		query.on('row', function(row) {
			results.push (row);
		});
		
		query.on('end', function() {
			res.json(results);
		});
	},
	
	/*
	 * Return the last values for a specific sensor
	 */
	getLastValueSensor: function(sensorId, res) {
		var results = [];
		var query = client.query('select * from value where sensor_id in (' +
			sensorId +
			') AND timestamp = (select max(timestamp) from value);');
		
		query.on('row', function(row){
			results.push(row);
		});
		
		query.on('end', function() {
			res.json(results);
		});
	},
	
	getMission: function (missionId) {
		query = client.query('SELECT * FROM mission WHERE id = $1 ORDER BY id', [missionId]);
		
		query.on('row', function(row) {
			return row;
		});
	},
	
	getValueSensorMission: function(missionId, sensorId, res) {
		var query = client.query('select * from mission where id = $1;', [missionId]);
		var found = true;
		console.log(missionId);	
		query.on('row', function(row) {
			console.log(row);
			found = true;
			var results = [];
			if(row.end_time != null) {
				console.log('welt');
				var query = client.query('SELECT * FROM value WHERE timestamp BETWEEN $1 AND $2 ORDER BY timestamp;', [row.start_time, row.end_time]);
			} else {
				var query = client.query('SELECT * FROM value WHERE timestamp BETWEEN $1 AND now()::timestamp ORDER BY timestamp;');
			}
			
			query.on('row', function(row) {
				results.push(row);
			})
			
			query.on('end', function() {
				res.json(results);
			});
		})
		
		query.on('end', function() {
			if(!found) {
			 res.json({});
			}
		});
	},
	
	/*
	 * 
	 */	
	getValues: function(missionId, res) {
		
		query = client.query('SELECT * FROM mission WHERE id = $1', [missionId]);
		var found = false;
		
		query.on('row', function(row) {
			found = true;
			var results = [];
		
			if (row.end_time != null) {
				var query = client.query('SELECT * FROM value WHERE timestamp BETWEEN \'' +
					row.start_time + 
					'\' AND \'' + 
					row.end_time +
					'\';');
			} else {
				var query = client.query('SELECT * FROM value WHERE timestamp BETWEEN \'' +
					row.start_time +
					'\' AND ' +
					'now()::timestamp;'
					);
			}
		
			query.on('row', function(row) {
				results.push(row);
			});
		
			query.on('end', function() {
				res.json(results);
			});
		});
		
		query.on('end', function() {
			if(!found) {
			 res.json({});
			}
		});
	}
};

module.exports = manager;
