module.exports = function(app, db) {

  var module = {};

  var waitForOtherJobsToFinish = require("./common/wait_for_other_jobs_to_finish")(app, db);

  //must call statNextJobCallback when success/fail happens
  //this triggers the next job to fire
  //not concurrent
  module.undeployLanderFromDomain = function(user, attr, callback) {
    var user_id = user.id;

    var job = attr.job;
    var landerData = attr.lander;

    var myJobId = job.id;
    var lander_id = job.lander_id;


    //




    db.jobs.updateDeployStatus(user, myJobId, "deployed", function(err) {
      if (err) {
        callback(err, [myJobId]);
      } else {
        console.log("FINISHED ! saving lander job !");
        callback(false, [myJobId]);
      }
    });




  };

  return module.undeployLanderFromDomain;

}
