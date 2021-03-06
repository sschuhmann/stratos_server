var restify 			= require('restify');
var restifyOAuth2 = require('restify-oauth2')
var hooks 				= require('./hook');

var config = require('./options.js');

var host = config.storageConfig.server.host || '0.0.0.0';
var port = config.storageConfig.server.port || '8080';

var mission = require ('./routes/mission.js');
var value 	= require ('./routes/value.js');
var sensor 	= require ('./routes/sensor.js');

var dbManager = require ('./models/database');

dbManager.initDatabase();

var server = restify.createServer ({
	name: 'Stratos API server'
});

server.use(restify.authorizationParser());
server.use(restify.bodyParser({mapParams: false}));
server.use(restify.queryParser());
restifyOAuth2.cc(server, {hooks: hooks});

server.use(function logger(req,res,next) {
  console.log(new Date(),req.method,req.url);
  next();
});

/* GET Routes*/
server.get ('/stratos/api/mission', 																mission.getAll);
server.get ('/stratos/api/activeMission', 													mission.getActiveMission);
server.get ('/stratos/api/missionValues', 									value.getValueSensorMission);
server.get ('/stratos/api/missionValuesSensor/:mission/:sensor',		value.getValueSensorMission);
server.get ('/stratos/api/lastValuesFrom', 													value.getLastValuesFrom)
server.get ('/stratos/api/lastValuesSensors',												value.getLastValueSensor)
server.get ('/stratos/api/lastValues', 															value.getLastValues);
server.get ('/stratos/api/forecast/:mission', 												value.getForecast);
server.get ('/stratos/api/sensor', 																	sensor.getAll);

/* POST ROUTES */
server.post('/stratos/api/mission', 							mission.create);
server.post('/stratos/api/value', 								value.addValue);
server.post('/stratos/api/valueList', 						value.addValueList);

server.on('uncaughtException',function(request, response, route, error){
  console.error(error.stack);
  response.send(error);
});

server.listen(port,host, function() {
  console.log('%s listening at %s', server.name, server.url);
});
