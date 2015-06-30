"use strict";

//Replace with Database and woch
var _ = require('underscore');
var crypto = require ('crypto');

// Replace with user database and key value store
var database = {
	clients: {
		testClient: {secret: "TEST", scopesGranted: ["one:read", "two"]},
		producer: {secret: "PROD", scopesGranted:["create_value"]},
		admin: {secret: "ADM", scopesGranted: ["create_value"]}
	},
	
	tokensToClientIds: {},
	tokensToScopes: {}
};

var userStore = {
	
	
}

function generateToken(data) {
	var random = Math.floor(Math.random() * 1000001);
	var timestamp = (new Date()).getTime();
	var sha256 = crypto.createHmac("sha256", random + "Secret" + timestamp);
	
	return sha256.update(data).digest("base64");
}

exports.grantClientToken = function (credentials, req, cb) {
	var isValid = _.has(database.clients, credentials.clientId) &&
		database.clients[credentials.clientId].secret === credentials.clientSecret;

	if (isValid) {
		var token = generateToken(credentials.clientId + ":" + credentials.clientSecret);
        database.tokensToClientIds[token] = credentials.clientId;
		return cb(null, token);
	}
	
	cb(null, false);
};

exports.grantScopes = function (credentials, scopesRequested, req, cb) {
	var scopesGranted = _.intersection(scopesRequested, database.clients[credentials.clientId].scopesGranted);
	database.tokensToScopes[credentials.token] = scopesGranted;
	
	cb(null, scopesGranted); 
};

exports.authenticateToken = function (token, req, cb) {
	if(_.has(database.tokensToClientIds, token)) {
		req.clientId = database.tokensToClientIds[token];
		req.scopesGranted = database.tokensToScopes[token];
		return cb(null, true);
	}
	
	cb(null, false);
};
