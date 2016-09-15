module.exports = function(app) {

  var module = {};
  
  var mysql = require("mysql");

  var db = mysql.createPool(app.config.dbConnectionInfo);


  module.users = require('./users')(app, db);
  module.landers = require('./landers')(app, db);
  module.groups = require('./groups')(app, db);
  module.domains = require('./domains')(app, db);
  module.js_snippets = require('./js_snippets')(app, db);
  module.updater = require('./updater')(app, db);
  module.jobs = require('./jobs')(app, db);
  module.aws = require('./aws')(app, db);
  module.common = require('./common')(app, db);
  module.log = require('./log')(app, db);
  module.deployed_domain = require('./deployed_domain')(app,db);
  return module;

}