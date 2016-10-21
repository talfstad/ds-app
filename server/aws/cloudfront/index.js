module.exports = function(app, dbApi) {
  
  //in the base class if it doesn't use the dbAPI
  var base = require("./base")(app);

  var AWS = require('aws-sdk');

  var module = _.extend({

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
            dbApi.jobs.checkIfExternalInterrupt(user, job_id, function(err, interruptCode) {
              if (err || interruptCode) {
                if (interruptCode) {

                  var err = {
                    code: interruptCode,
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

    }
  }, base);

  return module;
};
