module.exports = function(app, dbApi, controller) {

  var module = {};

  module.saveLander = function(user, attr, callback) {
    var job = attr.job;
    var landerData = attr.lander;

    var myJobId = job.id;
    var lander_id = job.lander_id;

    console.log("\n\n\nHERE ARE YOUR lander data: " + JSON.stringify(landerData) + "\n\n\n");

    //optimize lander and return new numbers for pagespeed!!

    //create staging dir
    dbApi.common.createStagingArea(function(err, stagingPath, stagingDir) {

      dbApi.aws.keys.getAmazonApiKeysAndRootBucket(user, function(err, awsData) {
        if (err) {
          callback(err, [myJobId]);
        } else {

          var username = user.user;
          var baseBucketName = awsData.aws_root_bucket;

          var directory = "landers/" + landerData.s3_folder_name + "/original";

          var credentials = {
            accessKeyId: awsData.aws_access_key_id,
            secretAccessKey: awsData.aws_secret_access_key
          }

          //copy the data down from the old s3, then push it to the new
          controller.aws.s3.copyDirFromS3ToStaging(lander_id, stagingPath, credentials, username, baseBucketName, directory, function(err) {
            if (err) {
              callback(err, [myJobId]);
            } else {
              var deleteStaging = false;
              controller.landers.add.optimizePushSave(deleteStaging, user, stagingPath, landerData.s3_folder_name, landerData, function(err, data) {
                if (err) {
                  callback(err, [myJobId]);
                } else {
                  dbApi.jobs.updateDeployStatus(user, myJobId, "deployed", function(err) {
                    if (err) {
                      callback(err, [myJobId]);
                    } else {
                      console.log("FINISHED ! saving lander job !");
                      callback(false, [myJobId]);
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

  return module.saveLander;

}
