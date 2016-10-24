module.exports = function(app, dbApi, controller) {

  var module = {};
  module.undeployLanderFromDomain = require('./undeploy_lander_from_domain')(app, dbApi, controller);
  module.undeployDomainFromLander = require('./undeploy_lander_from_domain')(app, dbApi, controller);
  module.deployLanderToDomain = require('./deploy_lander_to_domain/index')(app, dbApi, controller);
  module.deleteLander = require('./delete_lander')(app, dbApi, controller);
  module.deleteDomain = require('./delete_domain')(app, dbApi, controller);
  module.deleteGroup = require('./delete_group')(app, dbApi, controller);
  module.savingLander = require('./saving_lander')(app, dbApi, controller);
  module.ripLander = require('./rip_lander')(app, dbApi, controller);
  module.addLander = require('./add_lander')(app, dbApi, controller);

  // module.timeoutInitialized = false;

  module.startJob = function(action, user, attr) {
   
    try {
      app.log("action: " + action, "debug");

      module[action](user, attr, function(err, jobIdArr) {
        if (err) {
          if (err.code == "TimeoutInterrupt" || err.code == "ExternalInterrupt" || err.code == "UserReportedInterrupt") {
            if (err.staging_path) {
              var staging_path = err.staging_path;
              //delete the staging area
              dbApi.common.deleteStagingArea(staging_path, function(err) {
                console.log("finished " + JSON.stringify(jobIdArr));
                return;
              });
            } else {
              console.log("finished " + JSON.stringify(jobIdArr));
              return;
            }
          } else {
            if (jobIdArr.length > 0) {
              //set error and be done
              app.log("Non Interrupt Worker Error :  \n" + JSON.stringify(err), "debug");

              dbApi.jobs.setErrorAndStop(err.code, jobIdArr[0], function() {
                app.log("set error and stopped jobs: " + JSON.stringify(jobIdArr), "debug");
                return;
              });
            }
          }
        } else {
          if (jobIdArr.length > 0) {
            //finish successfully
            dbApi.jobs.finishedJobSuccessfully(user, jobIdArr, function() {
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
