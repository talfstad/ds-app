module.exports = function(app, db) {

  var module = {};
  
  module.rip = require('./rip')(app, db);
  module.fatal = require('./fatal')(app, db);
  
  return module;

}