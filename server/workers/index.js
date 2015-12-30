module.exports = function(app, db) {

  var moment = require("moment");


  var module = {};

  module.undeployLanderFromDomain = require('./undeploy_lander_from_domain')(app, db);
  module.deployLanderToDomain = require('./deploy_lander_to_domain')(app, db);
  module.addNewLander = require('./add_new_lander')(app, db);
  module.ripNewLander = require('./rip_new_lander')(app, db);
  module.deleteLander = require('./delete_lander')(app, db);


  //starts job only if:

  // JOBS a lander can have:
  // 1. undeploy from domain
  // 2. deploy to domain
  // 3. add a lander
  // 4. delete a lander
  //
  // start undeploy job only if:
  //  a. no deploy is happening on the domain
  //  b. no undeploy is happening already
  //
  // start deploy job only if:
  //  a. no undeploy job is processing
  //  b. no deploy is happening already
  //
  // start add lander job:
  //  a. immediately
  //
  // start delete lander job:
  //  a. immediately

  module.startJob = function(action, user, attr) {
    
    try {

      //get all jobs for user with lander_id and domain_id
      db.jobs.getAllProcessingForLanderDomain(user, attr, function(jobs) {

        var startJob = true;

        if (action == "deployLanderToDomain") {

          for (var i = 0; i < jobs.length; i++) {
            if (jobs[i].action == "undeployLanderFromDomain") {
              startJob = false;
            }
          }
        }

        if (action == "undeployLanderFromDomain") {
          for (var i = 0; i < jobs.length; i++) {
            if (jobs[i].action == "deployLanderToDomain") {
              startJob = false;
            }
          }
        }

        //if deploying wait for the deploy job to finish, it will trigger the delete after!
        if(action == "deleteLander"){
          for (var i = 0; i < jobs.length; i++) {
            if (jobs[i].action == "deployLanderToDomain") {
              startJob = false;
            }
          }
        }

        if (startJob) {
          //startNextJob is the callback the job should fire when finished
          module[action](user, attr, module.startNextJob);
        } else {
          console.log("NOT STARTING JOB HERE. will start when blocking job finishes")
        }

      });

    } catch (e) {
      console.log("job worker method does not exist!!!! must implement it.")
    }
  };

  // when job finished calls startNext()
  //
  // startNextJob takes params from the job that is calling it (the job that just finished)
  // from those it determines if there is another job that needs to start. if there is, it starts it

  //JOBS that can be started next
  // 1. undeploy from domain
  //    a. if job params is undeploy, look for a deploy job on same lander, user, domain
  // 2. deploy to domain
  //    a. if job params is deploy, look for an undeploy job on same lander, user, domain
  module.startNextJob = function(finishedJobAction, user, attr) {
    console.log("Looking for next job to start");

    db.jobs.getAllProcessingForLanderDomain(user, attr, function(jobs) {

      //get the next chronological job and start it
      var earliestJob;
      if (jobs) {
        earliestJob = jobs[0];

        for (var i = 0; i < jobs.length; i++) {

          var earliestJobMillis = moment(earliestJob).unix();
          var jobMillis = moment(jobs[i]).unix();

          if (earliestJobMillis - jobMillis > 0) {
            earliestJob = job[i];
          }

        }

        if (earliestJob) {
          module.startJob(earliestJob.action, user, earliestJob);
        }
      }


    });



  };

  return module;
}
