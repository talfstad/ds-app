module.exports = function(app, db) {

  var deleteLander = function(user, attr, callback) {

    var myJobId = attr.id;
    var user_id = user.id;
    var lander_id = attr.lander_id;
    var aws_root_bucket = user.aws_root_bucket;

    var landersToGet = [{
      lander_id: lander_id
    }];

    var credentials = {
      accessKeyId: user.aws_access_key_id,
      secretAccessKey: user.aws_secret_access_key
    };

    var username = user.user;

    db.landers.getAll(user, function(err, landers) {
      if (err) {
        callback({ code: "CouldNotGetLanderFromDb" }, [myJobId]);
      } else {
        var lander = landers[0];
        var s3_folder_name = lander.s3_folder_name;

        var currently_deployed_deployment_folder_name = lander.old_deployment_folder_name;

        //delete the s3_folder_folder_name
        var deleteS3Folder = function(folderPathToDelete, callback) {
          app.log("trying to delete path: " + folderPathToDelete, "debug");

          db.aws.s3.deleteDir(credentials, aws_root_bucket, folderPathToDelete, function(err) {
            if (err) {
              callback({ code: "CouldNotDeleteS3Folder" });
            } else {
              callback(false);
            }
          });
        };

        // bucket / username / landers / <s3_folder_name /
        var landerS3FolderPath = username + "/landers/" + s3_folder_name + "/";

        console.log(" s3 folder path to deletee: " + landerS3FolderPath);

        deleteS3Folder(landerS3FolderPath, function(err) {
          if (err) {
            callback(err, [myJobId]);
          } else {
            console.log("deleted that folder: " + landerS3FolderPath);
            
            db.landers.getAllDomainsLanderIsDeployedOn(user, lander_id, function(err, dbDomains) {
              if (err) {
                callback(err, [myJobId]);
              } else {

                app.log("\n\ngot domains !: " + JSON.stringify(dbDomains) + " \n\n", "debug");

                //creates old dir invalidation if necessary. this is not tracked by the job,
                //so it returns as soon as invalidation is made
                var invalidateDeletedDeploymentFolder = function(cloudfront_id, callback) {

                  //- create invalidation for this undeployment
                  var invalidationPath = "/" + currently_deployed_deployment_folder_name + "/*";
                  db.aws.cloudfront.createInvalidation(credentials, cloudfront_id, invalidationPath, function(err, invalidationData) {
                    if (err) {
                      callback({ code: "CouldNotCreateInvalidation" }, [myJobId]);
                    } else {

                      app.log("invalidationData: " + JSON.stringify(invalidationData), "debug");

                      var invalidation_id = invalidationData.Invalidation.Id;
                      callback(false, invalidation_id, cloudfront_id);
                    }
                  });

                };


                var undeployDomain = function(folderPathToDelete, cloudfront_id, callback) {
                  deleteS3Folder(folderPathToDelete, function(err) {
                    if (err) {
                      callback(err);
                    } else {
                      invalidateDeletedDeploymentFolder(cloudfront_id, function(err, invalidation_id, cloudfront_id) {
                        if (err) {
                          callback(err);
                        } else {

                          db.aws.cloudfront.waitForInvalidationComplete(user, myJobId, credentials, cloudfront_id, invalidation_id, function(err) {
                            if (err) {
                              callback(err);
                            } else {
                              app.log("undeploy domain complete: " + folderPathToDelete, "debug");
                              callback(false);

                            }
                          });

                        }
                      });
                    }
                  });
                };

                var undeployAllDomains = function(callback) {
                  //loop the domains here to run the undeploy
                  var asyncIndex = 0;
                  if (dbDomains.length > 0) {
                    for (var i = 0; i < dbDomains.length; i++) {
                      var domain = dbDomains[i];
                      var domain_name = domain.domain;
                      var cloudfront_id = domain.cloudfront_id

                      //- delete the directory
                      var folderPathToDelete = "domains/" + domain_name + "/" + currently_deployed_deployment_folder_name + "/";

                      undeployDomain(folderPathToDelete, cloudfront_id, function(err) {
                        if (err) {
                          callback(err, [myJobId]);
                        } else {
                          if (++asyncIndex == dbDomains.length) {
                            //this happens when all domains have been completely undeployed/invalidated
                            callback(false);
                          }
                        }
                      });
                    }
                  } else {
                    callback(false);
                  }
                };

                undeployAllDomains(function(err) {
                  if (err) {
                    callback(err, [myJobId]);
                  } else {
                    db.landers.deleteLander(user, lander_id, function(err) {
                      if (err) {
                        callback(err, [myJobId]);
                      } else {
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
    }, landersToGet);

  };

  return deleteLander;

};
