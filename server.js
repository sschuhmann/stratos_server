var restify = require('restify');
var restifyOAuth2 = require('restify-oauth2')
var hooks = require('./hook');

var host = process.env.HOST || '127.0.0.1';
var port = process.env.PORT || '3000';

var mission = require ('./routes/mission.js');
var value = require ('./routes/value.js');
var sensor = require ('./routes/sensor.js');

var dbManager = require ('./models/database');

dbManager.initDatabase();

var server = restify.createServer ({
	name: 'Stratos API server'
});

server.use(restify.authorizationParser());
server.use(restify.bodyParser({mapParams: false}));
restifyOAuth2.cc(server, {hooks: hooks});

server.use(function logger(req,res,next) {
  console.log(new Date(),req.method,req.url);
  next();
});

server.get ('/stratos/api/mission', mission.getAll);
server.get ('/stratos/api/value:mission', value.getMission);
server.get ('/stratos/api/sensor', sensor.getAll);
server.get ('/stratis/api/sensor:id', sensor.getOne);

server.on('uncaughtException',function(request, response, route, error){
  console.error(error.stack);
  response.send(error);
});

server.listen(port,host, function() {
  console.log('%s listening at %s', server.name, server.url);
});
