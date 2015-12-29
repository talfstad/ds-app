module.exports = function(app, db) {

  var module = {};

  var config = require("../config");

  //must call statNextJobCallback when success/fail happens
  //this triggers the next job to fire

  module.undeployLanderFromDomain = function(user, attr, startNextJobCallback) {
    //add to deployed_landers table
    var user_id = user.id;
    var lander_id = attr.lander_id;
    var domain_id = attr.domain_id;

    //1. remove from deployed_landers
    db.landers.undeployLanderFromDomain(user, lander_id, domain_id, function() {

      //2. finish the job successfully
      var finishedJobs = [attr.id];
      db.jobs.finishedJobSuccessfully(user, finishedJobs, function() {
        console.log("updated job to finished");

        startNextJobCallback("deployLanderToDomain", user, attr);

      });

    });




    console.log("now starting undeploy");

  };

  return module.undeployLanderFromDomain;

}
