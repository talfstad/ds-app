module.exports = function(app, db, base) {

  var module = {};
  
  module.rip = require('./rip')(app, db, base);
  module.add_lander = require('./add_lander')(app, db, base);
  module.fatal = require('./fatal')(app, db, base);
  
  return module;

}