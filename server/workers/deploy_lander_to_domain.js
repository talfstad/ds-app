module.exports = function(app, db) {

  var module = {};

  var config = require("../config");

  //must call statNextJobCallback when success/fail happens
  //this triggers the next job to fire
  module.deployLanderToDomain = function(user, attr) {

    var user_id = user.id;
    var lander_id = attr.lander_id;
    var domain_id = attr.domain_id;

    db.landers.deployLanderToDomain(user, lander_id, domain_id, function() {

      //1. add to deployed_landers so that if we wait to actually deploy the job,
      // any reloading of client will know that this is deploying

      var myJobId = attr.id;
      var interval;

      var runJobCode = function() {
        

        var jobAttr = {
          lander_id: lander_id,
          domain_id: domain_id
        };

        db.jobs.getAllNotDoneForLanderDomain(user, jobAttr, function(jobs) {
          //get the lowest job id
          if (jobs.length > 0) {

            var lowestJobId = jobs[0].id;
            for (var i = 0; i < jobs.length; i++) {
              if (jobs[i].id < lowestJobId) {
                lowestJobId = jobs[i].id;
              }
            }

            if (myJobId <= lowestJobId) {
              clearInterval(interval);

              //job code starts here



              var finishedJobs = [attr.id];

              //updates db which the updater pulls from to update the GUI
              //to the next job
              db.jobs.finishedJobSuccessfully(user, finishedJobs, function() {
                console.log("updated job to finished")
              });


              //end job code

            } else {
              console.log("my jobid: " + myJobId + " lowestJobId: " + lowestJobId)
            }
          }

        });
      }

      //run once before interval starts
      runJobCode();

      var intervalPeriod = 1000 * 30 // 30 seconds
      interval = setInterval(function() {
        runJobCode();
      }, intervalPeriod);

    });


  };

  return module.deployLanderToDomain;

}
