module.exports = function(app, db) {


  var dbLanders = require('./landers')(app, db);

  return {

    getActiveJobs: function(updaterJobsAttributes, user, callback) {

      var user_id = user.id;


      var addExtraToJob = function(addExtraCode, activeJob, callback) {
        if (!addExtraCode) {
          callback(false, activeJob);
        } else {
          activeJob.extra = {};

          var lander_id = activeJob.lander_id;
          var domain_id = activeJob.domain_id;

          if (addExtraCode == "finishedSavingLander") {

            //get the endpoint_load_times for the lander
            dbLanders.getEndpointLoadTimesFromLanderIdAndDomainId(user, lander_id, domain_id, function(err, endpoint_load_times) {
              if (err) {
                callback(err);
              } else {

                console.log("\n\nendpoint_load_times: " + JSON.stringify(endpoint_load_times));

                activeJob.extra.endpoint_load_times = endpoint_load_times;
                callback(false, activeJob);
              }
            });
          } else {
            callback(false, activeJob);
          }
        }
      };

      var getExtraForJob = function(oldDeployStatus, activeJob, callback) {

        if (!oldDeployStatus) {
          callback(false, activeJob);
        } else {

          //add stuff if this is a deployLanderToDomain job and it has changed from deploying to invalidating,
          //or deploying to deployed
          var addExtraCode = false;

          if (activeJob.action == "deployLanderToDomain" &&
            (activeJob.deploy_status == "invalidating" || activeJob.deploy_status == "deployed") &&
            oldDeployStatus == "deploying") {

            addExtraCode = "finishedSavingLander";
            //change from saving to not saving, add the extra things
          }

          addExtraToJob(addExtraCode, activeJob, function(err, activeJob) {
            if (err) {
              callback(err);
            } else {
              callback(false, activeJob);
            }
          });

        }

      };

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("SELECT * FROM jobs WHERE processing = ? AND user_id = ?", [true, user.id], function(err, activeJobs) {
            if (err) {
              callback(err);
            } else {

              //loop new active jobs to detect if job has changed (deploy_status is different on new db selection)
              //if changed, get the extra attributes to return and put them on the model
              var asyncIndex = 0;
              var finalActiveJobs = [];
              if (activeJobs.length > 0) {
                for (var i = 0; i < activeJobs.length; i++) {
                  var oldDeployStatus = false;
                  for (var j = 0; j < updaterJobsAttributes.length; j++) {
                    if (activeJobs[i].deploy_status != updaterJobsAttributes[j].deploy_status) {
                      oldDeployStatus = updaterJobsAttributes[j].deploy_status;
                    }
                  }

                  getExtraForJob(oldDeployStatus, activeJobs[i], function(err, activeJob) {
                    if (err) {
                      callback(err);
                    } else {
                      
                      finalActiveJobs.push(activeJob);

                      if (++asyncIndex == activeJobs.length) {

                        callback(false, finalActiveJobs);

                      }

                    }
                  });
                }
              } else {
                callback(false, []);
              }

            }
            connection.release();
          });
        }
      });
    }


  }

};
