module.exports = function(app, db) {

  var module = {};
  
  module.rip = require('./rip')(app, db);
  
  return module;

}