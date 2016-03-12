module.exports = function(app, db) {

  var moment = require("moment");


  var module = {};

  //these are the same because on the server they dont matter. they are different actions
  //because on the client, we will trigger a remove on that domain or lander from the campaign
  //once the job completes based on what its action is. so they cant be the same.
  module.undeployLanderFromDomain = require('./undeploy_lander_from_domain')(app, db);
  module.undeployDomainFromLander = require('./undeploy_lander_from_domain')(app, db);


  module.deployLanderToDomain = require('./deploy_lander_to_domain')(app, db);
  module.addNewLander = require('./add_new_lander')(app, db);
  module.ripNewLander = require('./rip_new_lander')(app, db);
  module.deleteLander = require('./delete_lander')(app, db);
  module.deleteDomain = require('./delete_domain')(app, db);


  module.startJob = function(action, user, attr) {

    try {

      //get all jobs for user with lander_id and domain_id
      db.jobs.getAllProcessingForLanderDomain(user, attr, function(jobs) {
        module[action](user, attr);
      });

    } catch (e) {
      console.log("job worker method does not exist!!!! must implement it.")
    }
  };

  return module;
}
