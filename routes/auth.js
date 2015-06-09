var jwt = require('jwt-simple');

var auth = {

	login: function(req, res) {
		var username = req.body.username || '';
		var password = req.body.password || '';
		
		if (username == '' || password == '') {
			res.status(401);
			//TODO Message
			return;
		}
		
		var userObj = auth.validate(username, password);
		
		if (!userObj) {
			res.status(401);
			//TODO Message
			
			return;
		}
		
		if (userObj) {
			res.json(genToken(userObj));
		}
	}, 
	
	validate: function (username, password) {
		var userObj = {
			name: 'steffen',
			role: 'admin',
			username: 'testapp'
		};
		
		return userObj;
	},
	
	validateUser: function(username) {
		var userObj = {
			name: 'steffen',
			role: 'admin',
			username: 'testapp'
		};
		
		return userObj;
	}
}
	
	function genToken(user) {
		var expires = expiresIn(7);
		var token = jwt.encode({
			exp: expires
		}, require('../config/secret')());
		
		return {
			token: token,
			expires: expires,
			user: user
		};
	}
	
	function expiresIn(numDays) {
		var dateObj = new Date();
		return dateObj.setDate(dateObj.getDate() + numDays);
	}
	
module.exports = auth;

