module.exports = function(app, db) {

  var module = {};

  module.deleteDomain = function(user, attr) {


    var myJobId = attr.id;
    var interval;

    var setErrorAndStop = function(err) {
      var code = err.code || "UnkownError";
      db.jobs.setErrorAndStop(code, myJobId, function(err) {
        console.log("error occured during delete domain: " + err);
      });
    };

    var runJobCode = function() {

      db.jobs.getAllProcessingForLanderDomain(user, attr, function(jobs) {

        //get the lowest job id
        var lowestJobId = jobs[0].id;
        for (var i = 0; i < jobs.length; i++) {
          if (jobs[i].id < lowestJobId) {
            lowestJobId = jobs[i].id;
          }
        }

        if (myJobId <= lowestJobId) {
          clearInterval(interval);

          //job code starts here!
          var domain_id = attr.domain_id;
          var job_id = attr.id;

          //get the aws stuff and the domain stuff
          db.aws.keys.getAmazonApiKeysAndRootBucket(user, function(err, awsData) {
            if (err) {
              setErrorAndStop({ code: "CouldNotGetApiKeysAndRootBucket" });
            } else {

              //get all other domain info
              db.domains.getSharedDomainInfo(domain_id, awsData.aws_root_bucket, function(err, domainInfo) {
                if (err) {
                  setErrorAndStop({ code: "CouldNotGetDomainInformation" });
                } else {
                  console.log("DOMAIN INFO :" + JSON.stringify(domainInfo));

                  var baseBucketName = domainInfo.aws_root_bucket;
                  var hosted_zone_id = domainInfo.hosted_zone_id;
                  var distribution_id = domainInfo.cloudfront_id;
                  var domain = domainInfo.domain;



                  var credentials = {
                    accessKeyId: awsData.aws_access_key_id,
                    secretAccessKey: awsData.aws_secret_access_key
                  }

                  //b. delete domain folder
                  db.aws.s3.deleteDomainFromS3(domain, baseBucketName, credentials, function(err) {
                    //dont care if bucket was already deleted, continue
                    app.log("done deleting from s3" + err, "debug");
                    if (err && err.code !== "NoSuchBucket") {
                      setErrorAndStop(err);
                    } else {
                      //c. delete hosted zone
                      db.aws.route53.deleteHostedZoneInformationForDomain(credentials, domain, hosted_zone_id, function(err, deleteHostedZoneResponseData) {
                        app.log("done deleteHostedZoneInformationForDomain" + err, "debug");

                        if (err) {
                          setErrorAndStop(err);
                        } else {
                          //d. delete cloudfront distribution
                          db.aws.cloudfront.deleteDistribution(credentials, distribution_id, function(err, deleteDistributionData) {
                            app.log("done deleteDistribution" + err, "debug");
                            if (err) {
                              // setErrorAndStop(err);

                              //if there is an error continue because its just alreayd probably deleted
                            }
                            //3. remove domain from domains table
                            db.domains.deleteSharedDomain(baseBucketName, domain_id, function(err, docs) {
                              app.log("done deleteDomain" + err, "debug");

                              if (err) {
                                setErrorAndStop(err);
                              } else {
                                //4. finish job
                                var finishedJobs = [job_id];
                                db.jobs.finishedJobSuccessfully(user, finishedJobs, function(err) {
                                  if (err) {
                                    setErrorAndStop(err)
                                  } else {
                                    //5. total success!
                                    console.log("successfully updated deleteDomain job to finished");
                                  }
                                });
                              }
                            });

                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });



          //end job code

        }

      });
    }

    //run once before interval starts
    runJobCode();

    var intervalPeriod = 1000 * 30 // 30 seconds
    interval = setInterval(function() {
      runJobCode();
    }, intervalPeriod);

  };

  return module.deleteDomain;

}
