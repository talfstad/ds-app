module.exports = function(app, db) {

  var module = {};
  
  module.rip = require('./rip/base')(app, db);
  module.add_lander = require('./add_lander/base')(app, db);
  module.fatal = require('./fatal/base')(app, db);
  
  return module;

}