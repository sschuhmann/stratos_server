var express = require('express');
var router = express.Router();

var auth = require('./auth.js');
var mission = require('./mission.js');
var value = require('./value.js');
var valuelist = require('./valuelist.js');

/*
 * Public routes
 */ 
router.post('/login', auth.login);

/*
 * Routes that can be accessed only by authenticated users
 */
router.get('/stratos/v1/mission', mission.getAll);
router.get('/stratos/v1/mission/:id', mission.getOne);

router.get('/stratos/v1/value', value.getAll) 
router.get('stratos/v1/value/:id', value.getValueWithID);
router.post('stratos/v1/value', value.addValue);

router.get('stratos/v1/valuelist/:day', valuelist.getValuesPerDay); 
router.get('stratos/v1/valuelist/:start/:end', valuelist.getValuesInRange);

module.exports = router;
