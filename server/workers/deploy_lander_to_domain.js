module.exports = function(app, db) {

  var module = {};

  var config = require("../config");

  //must call statNextJobCallback when success/fail happens
  //this triggers the next job to fire
  module.deployLanderToDomain = function(user, attr, startNextJobCallback) {
    //add to deployed_landers table
    console.log(JSON.stringify(attr));
    var user_id = user.id;
    var lander_id = attr.lander_id;
    var domain_id = attr.domain_id;

    //1. add to deployed_landers
    db.landers.deployLanderToDomain(user, lander_id, domain_id, function() {

      var finishedJobs = [attr.id];

      //updates db which the updater pulls from to update the GUI
      //to the next job
      db.jobs.finishedJobSuccessfully(user, finishedJobs, function() {
        console.log("updated job to finished")

        startNextJobCallback("deployLanderToDomain", user, attr);

      });

    });

    console.log("now starting deploy");

  };

  return module.deployLanderToDomain;

}
