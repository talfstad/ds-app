module.exports = function(app, db) {

  var module = {};

  var waitForOtherJobsToFinish = require("./common/wait_for_other_jobs_to_finish")(app, db);

  //must call statNextJobCallback when success/fail happens
  //this triggers the next job to fire
  //not concurrent
  module.undeployLanderFromDomain = function(user, attr, callback) {
    var user_id = user.id;


    var job = attr.job;

    var myJobId = job.id;

    var domain_id = job.domain_id;
    var lander_id = job.lander_id;
    var aws_root_bucket = user.aws_root_bucket;

    var landersToGet = [{
      lander_id: lander_id
    }];

    var credentials = {
      accessKeyId: user.aws_access_key_id,
      secretAccessKey: user.aws_secret_access_key
    };

    db.landers.getAll(user, function(err, landers) {
      if (err) {
        callback({ code: "CouldNotGetLanderFromDb" }, [myJobId]);
      } else {

        db.domains.getSharedDomainInfo(domain_id, aws_root_bucket, function(err, domain) {
          if (err) {
            callback({ code: "CouldNotGetDomainInformation" }, [myJobId]);
          } else {
            var lander = landers[0];

            var currently_deployed_deployment_folder_name = lander.old_deployment_folder_name;

            var domain_name = domain.domain;
            var cloudfront_id = domain.cloudfront_id

            //- delete the directory
            var folderPathToDelete = "domains/" + domain_name + "/" + currently_deployed_deployment_folder_name + "/";

            var deleteOldDeployedS3Dir = function(callback) {
              console.log("trying to delete path: " + folderPathToDelete);

              db.aws.s3.deleteDir(credentials, aws_root_bucket, folderPathToDelete, function(err) {
                if (err) {
                  callback({ code: "CouldNotDeleteS3Folder" });
                } else {
                  callback(false);
                }
              });
            };

            //creates old dir invalidation if necessary. this is not tracked by the job,
            //so it returns as soon as invalidation is made
            var invalidateDeletedDeploymentFolder = function(callback) {

              //- create invalidation for this undeployment
              var invalidationPath = "/" + currently_deployed_deployment_folder_name + "/*";
              console.log("invalidating the old deployed path because UNDEPLOY !: " + invalidationPath);
              db.aws.cloudfront.createInvalidation(credentials, cloudfront_id, invalidationPath, function(err, invalidationData) {
                if (err) {
                  callback({ code: "CouldNotCreateInvalidation" }, [myJobId]);
                } else {

                  console.log("invalidationData: " + JSON.stringify(invalidationData));

                  var invalidation_id = invalidationData.Invalidation.Id;
                  callback(false, invalidation_id);
                }
              });

            };


            deleteOldDeployedS3Dir(function(err) {
              if (err) {
                callback(err, [myJobId]);
              } else {
                invalidateDeletedDeploymentFolder(function(err, invalidation_id) {
                  if (err) {
                    callback(err, [myJobId]);
                  } else {
                    db.jobs.updateDeployStatus(user, myJobId, "undeploy_invalidating", function(err) {
                      if (err) {
                        callback(err, [myJobId]);
                      } else {
                        db.aws.cloudfront.waitForInvalidationComplete(user, myJobId, credentials, cloudfront_id, invalidation_id, function(err) {
                          if (err) {
                            if (err.code == "ExternalInterrupt") {
                              app.log("external interrupt55 T!! " + myJobId, "debug");
                            }
                            callback(err, [myJobId]);
                          } else {
                            //delete the deployed lander
                            db.deployed_domain.removeFromDeployedLanders(user, lander_id, domain_id, function(err) {
                              if (err) {
                                callback(err, [myJobId]);
                              } else {
                                db.jobs.updateDeployStatus(user, myJobId, "deployed", function(err) {
                                  if (err) {
                                    callback(err, [myJobId]);
                                  } else {
                                    console.log("FINISHED ! saving lander job !");
                                    callback(false, [myJobId]);
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    }, landersToGet);
  };

  return module.undeployLanderFromDomain;

}
