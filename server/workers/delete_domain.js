module.exports = function(app, db) {

  var module = {};

  var config = require("../config");

  module.deleteDomain = function(user, attr) {

    var domain_id = attr.domain_id;
    var job_id = attr.id;

    //get all other domain info
    db.domains.getDomain(user, domain_id, function(err, domainInfo) {
      var baseBucketName = domainInfo.aws_root_bucket;
      var hosted_zone_id = domainInfo.hosted_zone_id;
      var distribution_id = domainInfo.cloudfront_id;
      var domain = domainInfo.domain;

      var setErrorAndStop = function(err) {
        db.jobs.setErrorAndStop(job_id, function(err) {
          console.log("error occured during delete domain: " + err);
        });
      };

      //1. delete all things attached to this domain:
      //a. remove domain from all campaigns that have it
      db.domains.removeActiveCampaignsForDomain(user, domain_id, function(err, responseData) {
        if (err) {
          setErrorAndStop(err);
        } else {
          //b. remove all deployed_landers on that domain
          db.domains.removeDeployedLandersFromDomain(user, domain_id, function(err, responseData) {
            if (err) {
              setErrorAndStop(err);
            } else {

              //2. remove from aws
              //a. get credentials
              db.aws.keys.getAmazonApiKeys(user, function(err, awsKeyData) {
                if (err) {
                  setErrorAndStop(err);
                } else {

                  var credentials = {
                    accessKeyId: awsKeyData.aws_access_key_id,
                    secretAccessKey: awsKeyData.aws_secret_access_key
                  }

                  //b. delete bucket
                  db.aws.s3.deleteDomainFromS3(domain, baseBucketName, credentials, function(err) {
                    //dont care if bucket was already deleted, continue
                    if (err && err.code !== "NoSuchBucket") {
                      setErrorAndStop(err);
                    } else {
                      //c. delete hosted zone
                      db.aws.route53.deleteHostedZone(credentials, hosted_zone_id, function(err, deleteHostedZoneResponseData) {
                        if (err) {
                          setErrorAndStop(err);
                        } else {

                          //d. delete cloudfront distribution
                          db.aws.cloudfront.deleteDistribution(credentials, distribution_id, function(err, deleteDistributionData) {
                            if (err) {
                              setErrorAndStop(err);
                            } else {
                              //3. remove domain from domains table
                              db.domains.deleteDomain(user, domain_id, function(err, docs) {
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
    });
  };

  return module.deleteDomain;

}
