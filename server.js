var express = require('express');
var path = require('path');
var logger = require('morgan')
var bodyParser = require('body-parser')

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());

app.all('/*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT');
	res.header('Access-Control-Allow-Headers', 'Content-type, Accept, X-Access-Token, X-Key');
	
	next();
});

app.all('/stratos/v1/*', [require('./middlewares/validateRequest')]);

app.use('/', require('./routes'));

app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + server.address().port);
});
