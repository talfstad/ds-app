var mysql = require("mysql");

var config = require("../config");

var db = mysql.createConnection(config.dbConnectionInfo);
db.connect();


exports.users = require('./users')(db);
exports.landers = require('./landers')(db);