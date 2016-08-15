module.exports = function(app, db) {

  var module = {};

  // var optimizations = require("./deploy_lander_to_domain/optimizations")(app, db);


  //must call statNextJobCallback when success/fail happens
  //this triggers the next job to fire
  //not concurrent
  module.redeploy = function(user, attr, callback) {

    var user_id = user.id;
    var lander_id = attr.lander_id;
    var domain_id = attr.domain_id;
    var master_job_id = attr.master_job_id;
    var myJobId = attr.id;
    var aws_root_bucket = user.aws_root_bucket;
    var username = user.user;
    var credentials = {
      accessKeyId: user.aws_access_key_id,
      secretAccessKey: user.aws_secret_access_key
    }
    var landersToGet = [{
      lander_id: lander_id
    }];

    db.landers.getAll(user, function(err, landers) {
      if (err) {
        callback({ code: "CouldNotGetLanderFromDb" }, [myJobId]);
      } else {
        db.domains.getSharedDomainInfo(domain_id, aws_root_bucket, function(err, domain) {
          if (err) {
            callback({ code: "CouldNotGetDomainInformation" });
          } else {

            var lander = landers[0];
            var s3_folder_name = lander.s3_folder_name;
            var awsS3FolderPath = "/landers/" + s3_folder_name + "/optimized/";
            var deployment_folder_name = lander.deployment_folder_name;
            var currently_deployed_deployment_folder_name = lander.old_deployment_folder_name;

            var domain_name = domain.domain;
            var cloudfront_id = domain.cloudfront_id

            //- delete the directory
            var folderPathToDelete = "domains/" + domain_name + "/" + currently_deployed_deployment_folder_name;
            var folderPathToDeploy = "domains/" + domain_name + "/" + deployment_folder_name;

            var deleteOldDeployedS3Dir = function(callback) {
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
            var invalidateIfOldDeploymentFolderDifferent = function(callback) {

              //-if deployment_folder is different invalidate the old deployment_folder path
              if (currently_deployed_deployment_folder_name != "" && deployment_folder_name != currently_deployed_deployment_folder_name) {

                //- create invalidation for this undeployment
                var invalidationPath = "/" + currently_deployed_deployment_folder_name + "/*";
                console.log("invalidating the old deployed path because we changed it: " + invalidationPath);
                db.aws.cloudfront.createInvalidation(credentials, cloudfront_id, invalidationPath, function(err, invalidationData) {
                  if (err) {
                    console.log(err);
                    callback({ code: "CouldNotCreateInvalidation" }, [myJobId]);
                  } else {
                    console.log("invalidationData: " + JSON.stringify(invalidationData));
                    callback(false);
                  }
                });
              }
            };

            //only master job will actually do the work in this function
            masterPrepareLanderStagingArea = function(callback) {
              if (master_job_id) {
                callback(false);
              } else {

                //-create staging area
                db.common.createStagingDirectory(function(err, staging_path, staging_dir) {
                  if (err) {
                    callback(err);
                  } else {
                    //-bring lander into staging area from s3
                    db.aws.s3.copyDirFromS3ToStaging(lander_id, staging_path, credentials, username, aws_root_bucket, awsS3FolderPath, function(err) {
                      if (err) {
                        callback({ code: "CouldNotCopyLanderFromS3ToStaging" }, [myJobId]);
                      } else {
                        console.log("copied lander, staging path: " + staging_path);
                        callback(false);
                      }
                    });
                  }
                });
              }
            };

            //only slave jobs will actually do the work in this function
            var waitForMasterCompleteStagingAreaWork = function(callback) {
              //-if has master job id then check the master job id for deploy_status = deploying || invalidating
              if (!master_job_id) {
                callback(false);
              } else {
                var interval = setInterval(function() {
                  db.jobs.getJob(user, master_job_id, function(err, job) {
                    if (job.deploy_status == "deploying" ||
                      job.deploy_status == "invalidating") {

                      //ready to go!
                      clearInterval(interval);
                      callback(false, job.staging_path);
                    }
                  });
                }, app.config.workers.redeployCheckIfMasterReadyRate);
              }
            };

            //every redeploy job executes this function
            // var pushNewLanderToS3AndInvalidate = function(staging_path, callback) {
            //   //-copy it to s3


            //   //-invalidate the path

            //   callback(false);

            // };

            var pushNewLanderToS3AndInvalidate = function() {
              //- copy the lander up to the domain folder using the deployment_folder_name
              var awsDeploymentPath = "domains/" + domain_name + "/" + deployment_folder_name;
              db.aws.s3.copyDirFromStagingToS3(lander_id, false, staging_path, credentials, username, aws_root_bucket, awsDeploymentPath, function(err) {
                if (err) {
                  callback({ code: "CoudNotCopyLanderToS3DeploymentFolder" }, [myJobId]);
                } else {
                  //- create invalidation for this deployment
                  var invalidationPath = "/" + deployment_folder_name + "/*";
                  console.log("invalidation path: " + invalidationPath);
                  db.aws.cloudfront.createInvalidation(credentials, cloudfront_id, invalidationPath, function(err, invalidationData) {
                    if (err) {
                      console.log(err);
                      callback({ code: "CouldNotCreateInvalidation" }, [myJobId]);
                    } else {
                      console.log("invalidationData: " + JSON.stringify(invalidationData));

                      var invalidation_id = invalidationData.Invalidation.Id;
                      console.log("invalidation id: " + invalidation_id);
                      db.jobs.updateDeployStatus(user, myJobId, "invalidating", function(err) {
                        if (err) {
                          callback({ code: "CouldNotUpdateDeployStatus" }, [myJobId]);
                        } else {
                          db.common.deleteStagingArea(staging_path, function(err) {
                            if (err) {
                              callback({ code: "CouldNotDeleteStagingArea" });
                            } else {
                              //- wait for invalidation to finish and then finish job
                              db.aws.cloudfront.waitForInvalidationComplete(credentials, cloudfront_id, invalidation_id, function(err) {
                                if (err) {
                                  console.log(err);
                                  callback({ code: "CouldNotWaitForInvalidationComplete" }, [myJobId]);
                                } else {
                                  db.jobs.updateDeployStatus(user, myJobId, "deployed", function(err) {
                                    if (err) {
                                      callback({ code: "CouldNotUpdateDeployStatus" });
                                    } else {
                                      //finish job
                                      var finishedJobs = [attr.id];
                                      callback(false, finishedJobs);
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
            };

            //only master job will actually do the work in this function
            var masterWaitForSlavesToFinish = function(callback) {
              if (master_job_id) {
                callback(false);
              } else {
                var interval = setInterval(function() {
                  db.jobs.getSlaveJobsStillWorking(user, master_job_id, function(err, slaveJobs) {
                    if (slaveJobs.length <= 0) {
                      clearInterval(interval);
                      callback(false);
                    }
                  });
                }, app.config.workers.redeployCheckIfMasterReadyRate);
              }
            };

            //only master does this
            var deleteStagingDirectory = function(callback) {
              if (master_job_id) {
                callback(false);
              } else {
                db.common.deleteStagingDirectory(master_staging_path, function(err) {
                  callback(false);
                });
              }
            }

            // deleteOldDeployedS3Dir(function(err) {
            //   if (err) {
            //     callback(err);
            //   } else {
            //     invalidateIfOldDeploymentFolderDifferent(function(err) {
            //       if (err) {
            //         callback(err);
            //       } else {
            //         masterPrepareLanderStagingArea(function(err) {
            //           if (err) {
            //             callback(err);
            //           } else {
            //             waitForMasterCompleteStagingAreaWork(function(err, master_staging_path) {
            //               if (err) {
            //                 callback(err);
            //               } else {
            //                 pushNewLanderToS3AndInvalidate(master_staging_path, function(err) {
            //                   if (err) {
            //                     callback(err);
            //                   } else {
            //                     masterWaitForSlavesToFinish(function(err) {
            //                       if (err) {
            //                         callback(err);
            //                       } else {
            //                         //-when all slaves finished, delete staging directory
            //                         deleteStagingDirectory(function(err) {
            //                           if (err) {
            //                             callback(err);
            //                           } else {
            var finishedJobs = [myJobId];
            callback(false, finishedJobs);
            //                           }
            //                         });
            //                       }
            //                     });
            //                   }
            //                 });
            //               }
            //             });
            //           }
            //         });
            //       }
            //     });
            //   }
            // });
          }
        });
      }
    }, landersToGet);
  };

  return module.redeploy;

}
