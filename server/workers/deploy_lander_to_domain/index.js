module.exports = function(app, db) {

  var module = {};

  module.deployLanderToDomain = function(user, attr, callback) {
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
    };
    var deployed_row_id = attr.deployed_row_id;

    var landerAttr = attr.landerData;
    var modified = false;
    if (landerAttr) {
      modified = landerAttr.modified;
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
            callback({ code: "CouldNotGetDomainInformation" }, [myJobId]);
          } else {

            //if modified not set by landerData use the modified we get from the db
            var landerData = landers[0];
            if (!modified) {
              modified = landerData.modified;
            }

            var s3_folder_name = landerData.s3_folder_name;

            var awsS3FolderPath;
            if (modified) {
              awsS3FolderPath = "/landers/" + s3_folder_name + "/original/";
            } else {
              awsS3FolderPath = "/landers/" + s3_folder_name + "/optimized/";
            }

            var deployment_folder_name = landerData.deployment_folder_name;
            var currently_deployed_deployment_folder_name = landerData.old_deployment_folder_name;

            var domain_name = domain.domain;
            var cloudfront_id = domain.cloudfront_id

            //- delete the directory
            var folderPathToDelete = "domains/" + domain_name + "/" + currently_deployed_deployment_folder_name + "/";
            var folderPathToDeploy = "domains/" + domain_name + "/" + deployment_folder_name + "/";

            db.aws.s3.checkIfDirectoryExists(credentials, username, aws_root_bucket, folderPathToDeploy, function(err, folderPathToDeployCurrentlyExists) {
              if (err) {
                callback({ code: "CoudNotObjectExists" }, [myJobId]);
              } else {

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

                  if (currently_deployed_deployment_folder_name != "" && currently_deployed_deployment_folder_name != deployment_folder_name) {
                    //- create invalidation for this undeployment
                    var invalidationPath = "/" + currently_deployed_deployment_folder_name + "/*";
                    app.log("invalidating the old deployed path because we changed it: " + invalidationPath, "debug");
                    db.aws.cloudfront.createInvalidation(credentials, cloudfront_id, invalidationPath, function(err, invalidationData) {
                      if (err) {
                        callback({ code: "CouldNotCreateInvalidation" }, [myJobId]);
                      } else {
                        app.log("invalidationData: " + JSON.stringify(invalidationData), "debug");
                        callback(false);
                      }
                    });
                  } else {
                    callback(false);
                  }
                };

                //
                var masterOptimizeLandingPageIfModified = function(staging_path, callback) {
                  if (master_job_id) {
                    callback(false);
                  } else {

                    var s3_folder_name = landerData.s3_folder_name;

                    if (!modified) {
                      db.landers.common.unGzipAllFilesInStaging(staging_path, function(err) {
                        if (err) {
                          callback(err);
                        } else {
                          console.log("not optimizing!! no need but ungzipped ! : " + myJobId);
                          callback(false);
                        }
                      });
                    } else {
                      console.log("modified, updating lander " + myJobId);
                      //resave the lander to s3 before we can deploy it
                      var deleteStaging = false;
                      db.landers.common.add_lander.addOptimizePushSave(myJobId, user, staging_path, s3_folder_name, landerData, function(err, returnData) {
                        if (err) {
                          callback(err);
                        } else {
                          db.landers.common.unGzipAllFilesInStaging(staging_path, function(err) {
                            if (err) {
                              callback(err);
                            } else {
                              console.log("ungzipping ! : " + myJobId);
                              callback(false);
                            }
                          });
                        }
                      });
                    }
                  }
                };

                //only master job will actually do the work in this function
                var masterPrepareLanderStagingArea = function(callback) {
                  if (master_job_id) {
                    console.log(myJobId + " should only be here if slave " + master_job_id)
                    callback(false);
                  } else {
                    //-create staging area
                    db.common.createStagingArea(function(err, staging_path, staging_dir) {
                      if (err) {
                        callback(err);
                      } else {
                        //-bring lander into staging area from s3
                        db.aws.s3.copyDirFromS3ToStaging(lander_id, staging_path, credentials, username, aws_root_bucket, awsS3FolderPath, function(err) {
                          if (err) {
                            callback({ code: "CouldNotCopyLanderFromS3ToStaging" });
                          } else {
                            masterOptimizeLandingPageIfModified(staging_path, function(err) {
                              if (err) {
                                callback(err);
                              } else {
                                //add the staging path to the masters job db
                                db.jobs.addStagingPathToJob(staging_path, myJobId, function(err) {
                                  if (err) {
                                    callback(err);
                                  } else {
                                    callback(false, staging_path);
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                };

                //only slave jobs will actually do the work in this function
                var waitForMasterCompleteStagingAreaWork = function(master_staging_path, callback) {
                  //-if has master job id then check the master job id for deploy_status = deploying || invalidating
                  if (!master_job_id) {
                    callback(false, master_staging_path);
                  } else {

                    var getJobs = function() {
                      db.jobs.getJob(user, master_job_id, function(err, job) {
                        if (err) {
                          callback(err);
                        } else {
                          setTimeout(function() {
                            if (job.deploy_status == "deployed" ||
                              job.deploy_status == "invalidating") {
                              callback(false, job.staging_path);
                            } else {
                              getJobs();
                            }
                          }, app.config.workers.redeployCheckIfMasterReadyRate);
                        }
                      });
                    }

                    getJobs();
                  }

                };


                var pushNewLanderToS3AndInvalidate = function(staging_path, callback) {
                  //- copy the lander up to the domain folder using the deployment_folder_name
                  db.jobs.checkIfExternalInterrupt(user, myJobId, function(err, isInterrupt) {
                    if (err || isInterrupt) {
                      if (isInterrupt) {
                        app.log("external interrupt!! " + myJobId);
                        var err = {
                          code: "ExternalInterrupt",
                          staging_path: staging_path
                        };
                        callback(err);
                      } else {
                        callback(err);
                      }
                    } else {

                      var createInvalidation = function(callback) {
                        if (folderPathToDeployCurrentlyExists) {
                          var invalidationPath = "/" + deployment_folder_name + "/*";
                          app.log("invalidation path: " + invalidationPath, "debug");

                          db.aws.cloudfront.createInvalidation(credentials, cloudfront_id, invalidationPath, function(err, invalidationData) {
                            if (err) {
                              callback({ code: "CouldNotCreateInvalidation" });
                            } else {
                              callback(false, invalidationData)
                            }
                          });
                        } else {
                          callback(false, false);
                        }
                      };

                      db.aws.s3.copyDirFromStagingToS3(lander_id, false, staging_path, credentials, username, aws_root_bucket, folderPathToDeploy, function(err) {
                        if (err) {
                          callback({ code: "CoudNotCopyLanderToS3DeploymentFolder" });
                        } else {
                          //- create invalidation for this deployment
                          createInvalidation(function(err, invalidationData) {
                            if (err) {
                              callback({ code: "CouldNotCreateInvalidation" });
                            } else {
                              app.log("invalidationData: " + JSON.stringify(invalidationData), "debug");

                              var waitForInvalidationComplete = function(callback) {
                                if (folderPathToDeployCurrentlyExists) {

                                  db.jobs.updateDeployStatus(user, myJobId, "invalidating", function(err) {
                                    if (err) {
                                      callback({ code: "CouldNotUpdateDeployStatus" });
                                    } else {
                                      var invalidation_id = invalidationData.Invalidation.Id;
                                      db.aws.cloudfront.waitForInvalidationComplete(user, myJobId, credentials, cloudfront_id, invalidation_id, function(err) {
                                        if (err) {
                                          callback(err);
                                        } else {
                                          callback(false);
                                        }
                                      });
                                    }
                                  });
                                } else {
                                  callback(false);
                                }
                              };

                              //- wait for invalidation to finish and then finish job
                              waitForInvalidationComplete(function(err) {
                                if (err) {
                                  if (err.code == "ExternalInterrupt") {
                                    app.log("external interrupt2!! " + myJobId);
                                    err.staging_path = staging_path;
                                  }
                                  callback(err);
                                } else {
                                  callback(false);
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
                      db.jobs.getSlaveJobsStillWorking(user, myJobId, function(err, slaveJobs) {
                        if (slaveJobs.length <= 0) {
                          clearInterval(interval);
                          callback(false);
                        }
                      });
                    }, app.config.workers.redeployCheckIfMasterReadyRate);
                  }
                };

                //only master does this
                var deleteStagingArea = function(staging_path, callback) {
                  if (master_job_id) {
                    callback(false);
                  } else {
                    console.log(myJobId + " actually deleting staging area");
                    db.common.deleteStagingArea(staging_path, function(err) {
                      callback(false);
                    });
                  }
                };

                var runYslowSpeedTestOnEndpoints = function(callback) {
                  //get the url endpoints for the lander


                  //domain info to get link, 

                  //url endpoint id + filename to make link, run it


                  db.landers.getUrlEndpointsForLander(user, lander_id, function(err, dbUrlEndpoints) {
                    if (err) {
                      callback(err);
                    } else {
                      var asyncIndex = 0;
                      for (var i = 0; i < dbUrlEndpoints.length; i++) {
                        var url_endpoint_id = dbUrlEndpoints[i].id;
                        var filename = dbUrlEndpoints[i].filename;
                        var link = "http://" + domain_name + "/" + deployment_folder_name + "/" + filename;
                        app.log("url_endpoint_id: " + url_endpoint_id + "\ndeployed row id: " + deployed_row_id + "\nlink: " + link);

                        //for each deployed lander
                        var params = {
                          id: deployed_row_id,
                          load_time_data: {
                            link: link,
                            url_endpoint_id: url_endpoint_id
                          }
                        };

                        db.deployed_domain.getLoadTimeForEndpoint(user, params, function(err, responseObj) {
                          if (err) {
                            callback(err);
                          } else {
                            app.log("got load times for endpoint: " + JSON.stringify(responseObj), "debug");
                            if (++asyncIndex == dbUrlEndpoints.length) {
                              callback(false);
                            }
                          }
                        });
                      }
                    }
                  });
                };

                deleteOldDeployedS3Dir(function(err) {
                  if (err) {
                    callback(err, [myJobId]);
                  } else {
                    invalidateIfOldDeploymentFolderDifferent(function(err) {
                      if (err) {
                        callback(err, [myJobId]);
                      } else {
                        console.log(myJobId + " master prepare starting " + master_job_id);
                        masterPrepareLanderStagingArea(function(err, master_staging_path) {
                          if (err) {
                            callback(err, [myJobId]);
                          } else {
                            waitForMasterCompleteStagingAreaWork(master_staging_path, function(err, master_staging_path) {
                              if (err) {
                                callback(err, [myJobId]);
                              } else {
                                pushNewLanderToS3AndInvalidate(master_staging_path, function(err) {
                                  if (err) {
                                    callback(err, [myJobId]);
                                  } else {
                                    app.log(myJobId + " done pushNewLanderToS3AndInvalidate", "debug");
                                    runYslowSpeedTestOnEndpoints(function(err) {
                                      if (err) {
                                        callback(err, [myJobId]);
                                      } else {
                                        db.jobs.updateDeployStatus(user, myJobId, "deployed", function(err) {
                                          if (err) {
                                            callback({ code: "CouldNotUpdateDeployStatus" }, [myJobId]);
                                          } else {
                                            if (!master_job_id) {
                                              //if master finish job and still wait around

                                              db.jobs.finishedJobSuccessfully(user, [myJobId], function() {
                                                masterWaitForSlavesToFinish(function(err) {
                                                  if (err) {
                                                    callback(err, [myJobId]);
                                                  } else {
                                                    app.log(myJobId + " done masterWaitForSlavesToFinish", "debug");

                                                    //-when all slaves finished, delete staging directory
                                                    deleteStagingArea(master_staging_path, function(err) {
                                                      if (err) {
                                                        callback(err, [myJobId]);
                                                      } else {
                                                        app.log(myJobId + " done deleteStagingArea", "debug");

                                                        var finishedJobs = []; //master already finished his job above
                                                        callback(false, finishedJobs);
                                                      }
                                                    });
                                                  }
                                                });
                                              });
                                            } else {
                                              //slave just finishes
                                              var finishedJobs = [myJobId];
                                              callback(false, finishedJobs);
                                            }
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
            });
          }
        });

      }
    }, landersToGet);
  };

  return module.deployLanderToDomain;

}
