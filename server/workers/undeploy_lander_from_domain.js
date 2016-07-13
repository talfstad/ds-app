module.exports = function(app, db) {

  var module = {};

  var waitForOtherJobsToFinish = require("./common/wait_for_other_jobs_to_finish")(app, db);

  //must call statNextJobCallback when success/fail happens
  //this triggers the next job to fire
  //not concurrent
  module.undeployLanderFromDomain = function(user, attr, callback) {
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

    waitForOtherJobsToFinish(user, attr, function() {

      //- get the lander s3_folder_name
      var landersToGet = [{
        lander_id: lander_id
      }];
      db.landers.getAll(user, function(err, landers) {
        if (err) {
          callback({ code: "CouldNotGetLanderFromDb" }, [myJobId]);
        } else {

          db.domains.getDomain(user, domain_id, function(err, domain) {
            if (err) {
              callback({ code: "CouldNotGetDomainInformation" });
            } else {

              var lander = landers[0];
              var s3_folder_name = lander.s3_folder_name;
              var deployment_folder_name = lander.deployment_folder_name;
              var domain_name = domain.domain;
              var cloudfront_id = domain.cloudfront_id

              //- delete the directory
              var folderPathToDelete = "domains/" + domain_name + "/" + deployment_folder_name;
              console.log("deleting this dir: " + folderPathToDelete);

              db.aws.s3.deleteDir(credentials, aws_root_bucket, folderPathToDelete, function(err) {
                if (err) {
                  callback({ code: "CouldNotDeleteS3Folder" });
                } else {
                  //- create invalidation for this undeployment
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
                      db.jobs.updateDeployStatus(user, myJobId, "invalidating_delete", function(err) {
                        if (err) {
                          callback({ code: "CouldNotUpdateDeployStatus" }, [myJobId]);
                        } else {
                          //- wait for invalidation to finish and then finish job
                          db.aws.cloudfront.waitForInvalidationComplete(credentials, cloudfront_id, invalidation_id, function(err) {
                            if (err) {
                              console.log(err);
                              callback({ code: "CouldNotWaitForInvalidationComplete" }, [myJobId]);
                            } else {
                              db.landers.undeployLanderFromDomain(user, lander_id, domain_id, function(err) {
                                if (err) {
                                  callback({ code: "CouldNotDeleteLanderFromDeployedLanders" });
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
      }, landersToGet);
    });
  };

  return module.undeployLanderFromDomain;

}
