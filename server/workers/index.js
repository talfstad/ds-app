module.exports = function(app, db) {

  var moment = require("moment");

  var module = {};
  module.undeployLanderFromDomain = require('./undeploy_lander_from_domain')(app, db);
  module.undeployDomainFromLander = require('./undeploy_lander_from_domain')(app, db);
  module.deployLanderToDomain = require('./deploy_lander_to_domain/index')(app, db);
  module.deleteLander = require('./delete_lander')(app, db);
  module.deleteDomain = require('./delete_domain')(app, db);
  module.deleteCampaign = require('./delete_campaign')(app, db);
  module.savingLander = require('./saving_lander')(app, db);

  module.startJob = function(action, user, attr) {

    try {
      app.log("action: " + action, "debug");

      module[action](user, attr, function(err, jobIdArr) {
        if (err) {
          if (err.code == "ExternalInterrupt") {
            if (err.staging_path) {
              var staging_path = err.staging_path;
              //delete the staging area
              db.common.deleteStagingArea(staging_path, function(err) {
                app.log("deleted the staging area from job error: " + staging_path, "debug");
                return;
              });
            } else {
              return;
            }
          } else {
            if (jobIdArr.length > 0) {
              //set error and be done
              db.jobs.setErrorAndStop(err.code, jobIdArr[0], function() {
                console.log("set error and stopped jobs: " + JSON.stringify(jobIdArr));
                return;
              });
            }
          }
        } else {
          if (jobIdArr.length > 0) {
            //finish successfully
            db.jobs.finishedJobSuccessfully(user, jobIdArr, function() {
              console.log("finished " + JSON.stringify(jobIdArr));
              return;
            });
          }
        }
      });
    } catch (e) {
      console.log("job worker method does not exist!!!! must implement it. " + action);
    }

  };

  return module;
}
