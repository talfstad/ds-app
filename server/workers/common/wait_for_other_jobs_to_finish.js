module.exports = function(app, db) {

  var module = {};

  //must call statNextJobCallback when success/fail happens
  //this triggers the next job to fire
  //not concurrent
  module.waitForOtherJobsToFinish = function(user, attr, callback) {
    var interval;

    var user_id = user.id;
    var lander_id = attr.lander_id;
    var domain_id = attr.domain_id;

    var jobAttr = {
      lander_id: lander_id,
      domain_id: domain_id
    };

    var myJobId = attr.id;

    var aws_root_bucket = user.aws_root_bucket;
    var username = user.user;
    var credentials = {
      accessKeyId: user.aws_access_key_id,
      secretAccessKey: user.aws_secret_access_key
    }

    var jobAttr = {
      lander_id: lander_id,
      domain_id: domain_id
    };

    var myJobId = attr.id;

    var checkOthersFinished = function() {
      db.jobs.getAllNotDoneForLanderDomain(user, jobAttr, function(err, jobs) {
        if (err) {
          clearInterval(interval);
          callback(err);
        } else {
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
              callback(false);
            } else {
              //not ready to run job yet
              return false;
            }
          } else {
            //no conflicting jobs so we can run
            clearInterval(interval);
            callback(false);
          }
        }
      });
    };
    //run once before interval starts
    checkOthersFinished();

    interval = setInterval(function() {
      checkOthersFinished();
    }, app.config.workers.checkOthersFinishedRate);


  }

  return module.waitForOtherJobsToFinish;

}
