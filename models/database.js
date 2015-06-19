var pg = require('pg');
var connectionString = process.env.DATABASE_URL | 'postgres://192.168.178.47:5432/stratos';

var client = new pg.Client(connectionString);
client.connect();
