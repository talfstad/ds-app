module.exports = function(app, db) {

  var module = {};

  var config = require("../config");

  //must call statNextJobCallback when success/fail happens
  //this triggers the next job to fire
  module.deployLanderToDomain = function(user, attr) {

    var myJobId = attr.id;

    var runJobCode = function() {

      db.jobs.getAllProcessingForLanderDomain(user, attr, function(jobs) {

        //get the lowest job id
        var lowestJobId = jobs[0].id;
        for (var i = 0; i < jobs.length; i++) {
          if (jobs[i].id < lowestJobId) {
            lowestJobId = jobs[i].id;
          }
        }

        if (myJobId <= lowestJobId) {
          clearInterval(interval);

          //job code starts here



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
            });

          });



          //end job code




        }

      });
    }

    //run once before interval starts
    runJobCode();

    var intervalPeriod = 1000 * 30 // 30 seconds
    var interval = setInterval(function() {
      runJobCode();
    }, intervalPeriod);
  };

  return module.deployLanderToDomain;

}
