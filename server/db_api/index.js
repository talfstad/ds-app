var mysql = require("mysql");

var config = require("../config");

var db = mysql.createConnection(config.dbConnectionInfo);
db.connect();


exports.users = require('./users')(db);
exports.landers = require('./landers')(db);
exports.domains = require('./domains')(db);
exports.updater = require('./updater')(db);
exports.jobs = require('./jobs')(db);
exports.worker = require('./worker')(db);