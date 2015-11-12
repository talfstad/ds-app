module.exports = function(app, db) {

  var module = {};

  var config = require("../config");

  module.deployLanderToDomain = function(attr) {
    //add to deployed_landers table
    var user = attr.user;

    var lander_id = "";
    var domain_id = "";

    console.log("model attributes: " + modelAttributes);

    db.landers.deployLanderToDomain(user, lander_id, domain_id);

    console.log("now starting deploy");

  };

  return module.deployLanderToDomain;

}
