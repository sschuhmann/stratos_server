var jwt = require('jwt-simple');
var validateUser = require('../routes/auth').validateUser;

module.exports = function(req, res, next) {

	 var token = (req.body && req.body.access_token) || 
	 	(req.query && req.query.access_token) ||
	 	req.headers['x-access-token'];
	 
	 var key = (req.body && req.body.x_key) || 
	 	(req.query && req.query.x_key) ||
	 	req.headers['x_key'];
	 	
	if (token || key) {
		try {
			var decoded = jwt.decode(token, require('../config/secrect.js')());
			
			if(decoded.exp <= Date.now()) {
				res.status(400);
				res.json({
					"status": 400,
					"message": "Token expired"
				});
				return;	
			}
			
			
		} catch (err) {
			
		}
	}
}
