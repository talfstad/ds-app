module.exports = function(app, db) {

  var module = {};

  var config = require("../config");

  module.undeployLanderFromDomain = function(user, attr) {
    //add to deployed_landers table
    var user_id = user.id;
    var lander_id = attr.lander_id;
    var domain_id = attr.domain_id;

    //1. remove from deployed_landers
    db.landers.undeployLanderFromDomain(user, lander_id, domain_id, function() {

      //2. finish the job successfully
      var jobs = [attr.id];
      db.jobs.finishedJobSuccessfully(user, jobs, function(){
      	console.log("updated job to finished")
      }); 


    });



    console.log("now starting undeploy");

  };

  return module.undeployLanderFromDomain;

}
