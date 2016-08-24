module.exports = function(app, db) {

  var deleteDomain = function(user, attr, callback) {

    var myJobId = attr.id;
    var user_id = user.id;
    var domain_id = attr.domain_id;
    var aws_root_bucket = user.aws_root_bucket;

    var credentials = {
      accessKeyId: user.aws_access_key_id,
      secretAccessKey: user.aws_secret_access_key
    };

    var username = user.user;

    var undeployJobs = [];

    db.domains.deleteFromCampaignsWithDomains(user, domain_id, function(err) {
      if (err) {
        callback(err, [myJobId]);
      } else {
        db.domains.getAllLandersDeployedOnDomain(user, domain_id, function(err, dbLanders) {
          if (err) {
            callback(err, [myJobId]);
          } else {

            app.log("\n\ngot landers deployed !: " + JSON.stringify(dbLanders) + " \n\n", "debug");

            var registerUndeployJobs = function(callback) {
              //register undeploy jobs for all of these 
              //(will all be worked by this job and finished by this job)
              if (dbLanders.length > 0) {
                var asyncIndex = 0;
                _.each(dbLanders, function(deployedLander) {
                  var job = {
                    lander_id: deployedLander.lander_id,
                    domain_id: domain_id,
                    action: "undeployLanderFromDomain",
                    deploy_status: "undeploying"
                  };

                  db.jobs.registerJob(user, job, function(registeredUndeployJob) {

                    undeployJobs.push(registeredUndeployJob);

                    if (++asyncIndex == dbLanders.length) {
                      callback(false);
                    }

                  });
                });
              } else {
                callback(false);
              }
            };

            registerUndeployJobs(function(err) {
              if (err) {
                callback(err);
              } else {
                app.log("registered undeploy jobs for delete domain", "debug");

                db.domains.getDomain(user, domain_id, function(err, domain) {
                  if (err) {
                    callback(err, [myJobId]);
                  } else {
                    var hostedZoneId = domain.hosted_zone_id;
                    var domainName = domain.domain;
                    var cloudfront_id = domain.cloudfront_id;

                    //  . delete the hosted zone for the domain
                    db.aws.route53.deleteHostedZone(credentials, hostedZoneId, function(err) {
                      if (err) {
                        callback(err, [myJobId]);
                      } else {

                        app.log("deleted hosted zone for delete domain", "debug");

                        //delete the s3_folder_folder_name
                        var deleteDomainsS3Folder = function(callback) {
                          var folderPathToDelete = "domains/" + domainName + "/";

                          app.log("Delete DOMAIN job : -- : trying to delete path: " + folderPathToDelete, "debug");

                          db.aws.s3.deleteDir(credentials, aws_root_bucket, folderPathToDelete, function(err) {
                            if (err) {
                              callback({ code: "CouldNotDeleteS3Folder" });
                            } else {
                              callback(false);
                            }
                          });
                        };

                        deleteDomainsS3Folder(function(err) {
                          if (err) {
                            callback(err, [myJobId]);
                          } else {
                            app.log("deleted domain s3 folder for delete domain", "debug");

                            db.aws.cloudfront.deleteDistribution(credentials, cloudfront_id, function(err) {
                              if (err) {
                                callback(err, [myJobId]);
                              } else {
                                app.log("deleted CF distro for delete domain " + cloudfront_id, "debug");

                                db.domains.deleteDomain(user, domain_id, function(err) {
                                  if (err) {
                                    callback(err, [myJobId]);
                                  } else {
                                    db.jobs.finishedJobSuccessfully(user, undeployJobs, function(err) {
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

  return deleteDomain;

};
