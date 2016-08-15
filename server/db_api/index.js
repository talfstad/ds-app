module.exports = function(app) {

  var module = {};
  
  var mysql = require("mysql");

  var db = mysql.createPool(app.config.dbConnectionInfo);


  module.users = require('./users')(db);
  module.landers = require('./landers')(app, db);
  module.campaigns = require('./campaigns')(db);
  module.domains = require('./domains')(db);
  module.js_snippets = require('./js_snippets')(app, db);
  module.updater = require('./updater')(db);
  module.jobs = require('./jobs')(app, db);
  module.aws = require('./aws')(app, db);
  module.common = require('./common')(db);
  module.log = require('./log')(app, db);
  module.deployed_domain = require('./deployed_domain')(app,db);
  return module;

}