
  var mysql = require("mysql");

  var config = require("../config");

  var db = mysql.createPool(config.dbConnectionInfo);


  exports.users = require('./users')(db);
  exports.landers = require('./landers')(db);
  exports.campaigns = require('./campaigns')(db);
  exports.domains = require('./domains')(db);
  exports.js_snippets = require('./js_snippets')(db);
  exports.updater = require('./updater')(db);
  exports.jobs = require('./jobs')(db);
  exports.aws = require('./aws')(db);
  exports.common = require('./common')(db);