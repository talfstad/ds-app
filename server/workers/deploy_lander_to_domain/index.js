module.exports = function(app, db) {

  var module = {};

  var config = require("../../config");
  var optimizations = require("./optimizations")(app, db);

  //must call statNextJobCallback when success/fail happens
  //this triggers the next job to fire
  //not concurrent
  module.deployLanderToDomain = function(user, attr, callback) {
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

    db.landers.addLanderToDeployedLanders(user, lander_id, domain_id, function() {
      module.waitForOtherJobsToFinish(user, attr, function() {
        //- get the lander s3_folder_name
        var landersToGet = [{
          lander_id: lander_id
        }];
        db.landers.getAll(user, function(err, landers) {
          if (err) {
            callback({ code: "CouldNotGetLanderFromDb" }, [myJobId]);
          } else {

            db.domains.getDomain(user, domain_id, function(err, domain) {

              var lander = landers[0];
              var optimized = lander.optimized;
              var s3_folder_name = lander.s3_folder_name;
              var deployment_folder_name = lander.deployment_folder_name;
              var domain_name = domain.domain;
              var cloudfront_id = domain.cloudfront_id

              //- create staging area
              db.common.createStagingArea(function(err, staging_path, staging_dir) {
                if (err) {
                  callback({ code: 'CouldNotCreateStagingArea' }, [myJobId]);
                } else {
                  //- copy lander from s3 to staging area
                  var awsS3FolderPath = "/landers/" + s3_folder_name;
                  db.aws.s3.copyDirFromS3ToStaging(staging_path, credentials, username, aws_root_bucket, awsS3FolderPath, function(err) {
                    if (err) {
                      callback({ code: "CouldNotCopyLanderFromS3ToStaging" }, [myJobId]);
                    } else {

                      var pushToS3AndInvalidate = function() {
                        //- copy the lander up to the domain folder using the deployment_folder_name
                        var awsDeploymentPath = "domains/" + domain_name + "/" + deployment_folder_name;
                        db.aws.s3.copyDirFromStagingToS3(staging_path, credentials, username, aws_root_bucket, awsDeploymentPath, function(err) {
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
                      }

                      //- check if optimized
                      if (optimized) {
                        db.jobs.updateDeployStatus(user, myJobId, "optimizing", function(err) {
                          if (err) {
                            callback({ code: "CouldNotUpdateDeployStatusOptimizing" }, [myJobId]);
                          } else {

                            optimizations.optimizeJs(staging_path, function(err) {
                              console.log("optimizing js");
                              if (err) {
                                callback({ code: "CouldNotOptimizeJs" }, [myJobId]);
                              } else {
                                optimizations.optimizeCss(staging_path, function(err) {
                                  console.log("optimizing css");
                                  if (err) {
                                    callback({ code: "CouldNotOptimizeCss" }, [myJobId]);
                                  } else {
                                    console.log("optimizing html");
                                    optimizations.optimizeHtml(staging_path, function(err) {
                                      if (err) {
                                        callback({ code: "CouldNotOptimizeHtml" }, [myJobId]);
                                      } else {
                                        optimizations.optimizeImages(staging_path, function(err) {
                                          if (err) {
                                            callback({ code: "CouldNotOptimizeImages" }, [myJobId]);
                                          } else {
                                            pushToS3AndInvalidate();
                                          }
                                        })
                                      }
                                    });
                                  }
                                });
                              }

                            });


                          }
                        });

                      } else {
                        pushToS3AndInvalidate();
                      }
                    }
                  });
                }
              });
            });
          }
        }, landersToGet);
      });
    });
  };


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
    }, config.workers.checkOthersFinishedRate);


  }

  return module.deployLanderToDomain;

}
