module.exports = function(app, db) {

  var module = {};

  var AWS = require('aws-sdk');
  var uuid = require('uuid');
  var moment = require('moment');

  var dbJobsApi = require('../jobs')(app, db);

  return {

    createInvalidation: function(credentials, distribution_id, invalidationPath, callback) {
      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });
      AWS.config.update(credentials);
      var cloudfront_client = new AWS.CloudFront();

      var callerRef = uuid.v4();

      var params = {
        DistributionId: distribution_id,
        InvalidationBatch: {
          CallerReference: callerRef,
          Paths: {
            Quantity: 1,
            Items: [
              invalidationPath
            ]
          }
        }
      };

      cloudfront_client.createInvalidation(params, function(err, data) {
        if (err) {
          callback(err);
        } else {
          callback(false, data);
        }
      });

    },

    waitForInvalidationComplete: function(user, job_id, credentials, distribution_id, invalidation_id, callback) {
      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });
      AWS.config.update(credentials);
      var cloudfront_client = new AWS.CloudFront();

      var params = {
        DistributionId: distribution_id,
        Id: invalidation_id,
      };
      var getInvalidation = function() {
        cloudfront_client.getInvalidation(params, function(err, data) {
          if (err) {
            callback(err);
          } else {
            dbJobsApi.checkIfExternalInterrupt(user, job_id, function(err, isInterrupt) {
              if (err || isInterrupt) {
                if (isInterrupt) {

                  var err = {
                    code: "ExternalInterrupt",
                  };
                  callback(err);
                } else {

                  callback({ code: "CouldNotWaitForInvalidationComplete" });
                }
              } else {
                setTimeout(function() {
                  app.log("checking invalidation status: " + data.Invalidation.Status, "debug");
                  if (data.Invalidation.Status === "Completed") {
                    callback(false);
                  } else {
                    getInvalidation();
                  }
                }, app.config.cloudfront.invalidationPollDuration);
              }
            });
          }
        });
      };

      getInvalidation();

    },

    makeCloudfrontDistribution: function(credentials, domain, path, bucketName, callback) {
      //needs a / in the beginning because aws appends it to domain name
      // console.log("origin path: " + path)
      //set keys before every action
      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });
      AWS.config.update(credentials);
      var cloudfront_client = new AWS.CloudFront();

      var index_name = "index.html";

      var error;

      var callerRef = uuid.v4();

      var timestamp = moment().format();

      var s3_id = 'domain-' + bucketName;
      var s3_domain = bucketName + '.s3.amazonaws.com';

      // console.log("s3 domain name: " + s3_domain);

      var params = {
        DistributionConfig: { /* required */
          CallerReference: callerRef,
          /* required */
          Comment: 'Created by Lander DS on ' + timestamp,
          /* required */
          DefaultCacheBehavior: { /* required */
            ForwardedValues: { /* required */
              Cookies: { /* required */
                Forward: 'none' /* required */
              },
              QueryString: true,
              /* required */
            },
            MinTTL: 0,
            /* required */
            TargetOriginId: s3_id,
            /* required */
            TrustedSigners: { /* required */
              Enabled: false,
              /* required */
              Quantity: 0 /* required */
            },
            ViewerProtocolPolicy: 'allow-all',
            /* required */
            AllowedMethods: {
              Items: [ /* required */
                'GET', 'HEAD'
                /* more items */
              ],
              Quantity: 2,
              /* required */
              CachedMethods: {
                Items: [ /* required */
                  'GET', 'HEAD'
                  /* more items */
                ],
                Quantity: 2 /* required */
              }
            },
            DefaultTTL: 86400,
            MaxTTL: 31536000,
            SmoothStreaming: false,
            Compress: true
          },
          Enabled: true,
          /* required */
          Origins: { /* required */
            Quantity: 1,
            /* required */
            Items: [{
                DomainName: s3_domain,
                /* required */
                Id: s3_id,
                /* required */
                OriginPath: path,
                S3OriginConfig: {
                  OriginAccessIdentity: '' /* required */
                }
              }
              /* more items */
            ]
          },
          Aliases: {
            Quantity: 2,
            /* required */
            Items: [
              domain,
              'www.' + domain
              /* more items */
            ]
          },
          DefaultRootObject: index_name,
          PriceClass: 'PriceClass_All'
        }
      };

      cloudfront_client.createDistribution(params, function(err, data) {
        if (err) {
          console.log(err, err.stack);
          error = {
            code: "ErrorCreatingCloudfrontDistribution"
          };
          callback(error, {});
        } else {
          callback(error, data.DomainName, data.Id);
        }
      });
    },

    getDistributionConfig: function(credentials, distributionId, callback) {
      //set keys before every action
      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });

      AWS.config.update(credentials);

      var cloudfront_client = new AWS.CloudFront();

      var params = {
        Id: distributionId,
      };

      cloudfront_client.getDistributionConfig(params, function(err, data) {
        if (err) {
          callback(err);
          console.log(err);
        } else {
          callback(false, data);
        }

      });

    },

    getDistribution: function(credentials, distributionId, callback) {
      //set keys before every action
      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });

      AWS.config.update(credentials);

      var cloudfront_client = new AWS.CloudFront();

      var params = {
        Id: distributionId,
      };

      cloudfront_client.getDistribution(params, function(err, data) {
        if (err) {
          callback(err);
        } else {
          callback(false, data);
        }
      });
    },

    disableCloudfrontDistribution: function(credentials, distributionId, callback) {
      var me = this;
      //timeout if not completed within 20 minutes
      var minutesToWait = 40;
      var timeout = 1000 * 60 * minutesToWait; //1000ms = 1 s * 60 = 1 minute * 40 = 40 minutes

      //poll every minute
      var pollRate = 1000 * 60 // 1 minute

      var elapsedTime = 0; //in milliseconds

      //set keys before every action
      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });
      AWS.config.update(credentials);
      var cloudfront_client = new AWS.CloudFront();

      //disable it
      this.getDistributionConfig(credentials, distributionId, function(err, data) {
        if (!data) {
          callback("NoDistribution");
          return;
        }
        var etag = data.ETag;
        var distributionConfig = data.DistributionConfig;
        if (err) {
          callback(err);
        } else {
          app.log("Distribution params for: " + distributionId + " enabled: " + distributionConfig.Enabled, "debug");

          //if disabled already return!
          if (!distributionConfig.Enabled) {
            callback(false);
          } else {
            //update distribution config to disable it
            distributionConfig.Enabled = false;

            //create the formatted params
            var updateDistributionParams = {
              Id: distributionId,
              IfMatch: etag,
              DistributionConfig: distributionConfig
            };

            //2. send the new config to aws
            cloudfront_client.updateDistribution(updateDistributionParams, function(err, data) {
              var etag = data.ETag;
              if (err) {
                callback(err);
              } else {

                //now that its disabling wait for it to disable and then delete it.
                var interval = setInterval(function() {
                  //increase the elapsed time
                  elapsedTime += pollRate;
                  //if timeout has happened clear interval and return error
                  if (elapsedTime > timeout) {
                    clearInterval(interval);
                    var error = {
                      code: "disableCloudfrontDistributionTimeout",
                      msg: "Disabling Distribution has taken more than " + minutesToWait + " minutes"
                    }
                    console.log("Error: timeout on disable CF");
                    callback(error);
                  } else {

                    //check to see if it's done disabling
                    //1. get config for it
                    me.getDistribution(credentials, distributionId, function(err, data) {
                      app.log("got distribution: T " + err, "debug");
                      if (err) {
                        callback(err);
                      } else {
                        var distribution = data.Distribution;
                        var enabled = data.DistributionConfig.Enabled;

                        //quit if its enabled, something really weird/bad happened
                        if (enabled) {
                          clearInterval(interval);
                          var error = {
                            code: "DistributionNotDisabled",
                            msg: "Somehow your distribution was re-enabled even though we just disabled it."
                          }
                          console.log("Error: distribution wasn't disabled so we're stopping");
                          callback(error);
                        } else {
                          //it's disabled so check status!
                          //2. check the config status = "Deployed" if is then we're good
                          if (distribution.Status === "Deployed") {
                            console.log("successfully disabled cloudfront distribution")
                              //successfully disabled, lets clear it
                            clearInterval(interval);
                            callback(false, etag);
                          }
                        }
                      }
                    });
                  }
                }, pollRate);
              }
            });
          }


        }
      });
    },

    deleteDistribution: function(credentials, distributionId, callback) {
      //set keys before every action
      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });
      AWS.config.update(credentials);
      var cloudfront_client = new AWS.CloudFront();

      //disable first
      this.disableCloudfrontDistribution(credentials, distributionId, function(err, etag) {
        app.log("disabled cloudfront distribution: " + err + " === etag: " + etag);

        if (err) {
          callback(err);
        } else {
          console.log("disabled distro");
          //now delete the CF distribution
          var params = {
            Id: distributionId,
            IfMatch: etag
          };

          cloudfront_client.deleteDistribution(params, function(err, data) {
            if (err) {
              callback(err);
            } else {
              callback(false, true);
            }
          });
        }


      });

    }

  }
}
