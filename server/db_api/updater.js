module.exports = function(app, db) {


  var dbLanders = require('./landers')(app, db);

  return {

    getActiveJobs: function(updaterJobsAttributes, user, callback) {

      var user_id = user.id;
      var aws_root_bucket = user.aws_root_bucket;

      var addExtraToJob = function(addExtraCode, activeJob, callback) {

        if (!addExtraCode) {
          callback(false, activeJob);
        } else {
          activeJob.extra = {};

          var lander_id = activeJob.lander_id;
          var domain_id = activeJob.domain_id;

          if (addExtraCode == "finishedSavingLander") {

            //get the pagespeed scores for the lander
            dbLanders.getPagespeedScoresForLander(user, lander_id, domain_id, function(err, pagespeed_scores) {
              if (err) {
                callback(err);
              } else {
                activeJob.extra.pagespeed = pagespeed_scores;
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

          if (activeJob.action == "deployLanderToDomain") {
            if (activeJob.deploy_status == "invalidating" || activeJob.deploy_status == "deployed") {
              if (oldDeployStatus == "deploying" && !activeJob.master_job_id) {
                if (oldDeployStatus != activeJob.deploy_status) {
                  addExtraCode = "finishedSavingLander";
                }
              }
            }

            //change from saving to not saving, add the extra things
          } else if (activeJob.action == "savingLander") {
            if (activeJob.deploy_status == "deployed" && oldDeployStatus == "saving") {
              if (!activeJob.master_job_id) {
                if (oldDeployStatus != activeJob.deploy_status) {
                  addExtraCode = "finishedSavingLander";
                }
              }
            }
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
          connection.query("SELECT * FROM jobs WHERE processing = ? AND user_id = ?", [true, user.id], function(err, userActiveJobsArr) {
            if (err) {
              callback(err);
            } else {
              //get shared domain level jobs (not deploys undeploys)
              connection.query("SELECT a.* FROM jobs a JOIN domains b ON a.domain_id = b.id WHERE a.processing = ? AND a.action = ? AND b.aws_root_bucket = ?", [true, "deleteDomain", aws_root_bucket], function(err, activeSharedJobsArr) {
                if (err) {
                  callback(err);
                } else {

                  var activeJobsArr = userActiveJobsArr.concat(activeSharedJobsArr);

                  //loop new active jobs to detect if job has changed (deploy_status is different on new db selection)
                  //if changed, get the extra attributes to return and put them on the model
                  var asyncIndex = 0;
                  var finalActiveJobs = [];
                  if (activeJobsArr.length > 0) {
                    for (var i = 0; i < activeJobsArr.length; i++) {
                      var oldDeployStatus = false;
                      for (var j = 0; j < updaterJobsAttributes.length; j++) {
                        if (activeJobsArr[i].id == updaterJobsAttributes[j].id) {
                          if (activeJobsArr[i].deploy_status != updaterJobsAttributes[j].deploy_status) {
                            oldDeployStatus = updaterJobsAttributes[j].deploy_status;
                          }
                        }
                      }

                      getExtraForJob(oldDeployStatus, activeJobsArr[i], function(err, activeJob) {
                        if (err) {
                          callback(err);
                        } else {

                          finalActiveJobs.push(activeJob);

                          if (++asyncIndex == activeJobsArr.length) {

                            callback(false, finalActiveJobs);

                          }

                        }
                      });
                    }
                  } else {
                    callback(false, []);
                  }

                }
              });

            }
            connection.release();
          });
        }
      });
    }


  }

};
