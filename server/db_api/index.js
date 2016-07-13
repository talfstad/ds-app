module.exports = function(app) {

  var module = {};
  
  var mysql = require("mysql");

  var db = mysql.createPool(app.config.dbConnectionInfo);

  module.users = require('./users')(db);
  module.landers = require('./landers')(db);
  module.campaigns = require('./campaigns')(db);
  module.domains = require('./domains')(db);
  module.js_snippets = require('./js_snippets')(db);
  module.updater = require('./updater')(db);
  module.jobs = require('./jobs')(app, db);
  module.aws = require('./aws')(db);
  module.common = require('./common')(db);

  return module;

}