module.exports = function(app, db) {
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
    //start job
    console.log("\nACTION: " + action);
    try {
      //startNextJob is the callback the job should fire when finished
      module[action](user, attr, module.startNextJob);
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
    console.log("ok ok: here in startnextjob")
    if (finishedJobAction == "deployLanderToDomain") {



    } else if (finishedJobAction == "undeployLanderFromDomain") {



    }
  };

  return module;
}
