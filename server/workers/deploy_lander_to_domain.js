module.exports = function(app, db) {

  var module = {};

  var config = require("../config");

  module.deployLanderToDomain = function(user, attr) {
    //add to deployed_landers table
    console.log(JSON.stringify(attr));
    var user_id = user.id;
    var lander_id = attr.lander_id;
    var domain_id = attr.domain_id;

    //1. add to deployed_landers
    db.landers.deployLanderToDomain(user, lander_id, domain_id, function(){

      //2. 
      console.log("successfully added to deployed landers");


    });

    console.log("now starting deploy");

  };

  return module.deployLanderToDomain;

}
