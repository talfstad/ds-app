module.exports = function(app, passport) {

  var Puid = require('puid');
  var db = require("../../db_api")(app);

  var mkdirp = require("mkdirp");
  var rimraf = require("rimraf");
  var uuid = require("uuid");


  var module = {

    new: function(user, landerData, callback) {
      var me = this;

      //1. rip the lander and its resources into staging
      db.common.createStagingArea(function(err, stagingPath, stagingDir) {
        if (err) {
          callback(err);
        } else {

          landerData.s3_folder_name = stagingDir;
          landerData.deployment_folder_name = stagingDir;

          db.aws.keys.getAmazonApiKeysAndRootBucket(user, function(err, awsData) {
            if (err) {
              callback(err);
            } else {

              var username = user.user;
              var baseBucketName = awsData.aws_root_bucket;

              var fromDirectory = "/landers/" + landerData.from_s3_folder_name + "/original";
              var directory = username + "/landers/" + landerData.s3_folder_name + "/original";

              var credentials = {
                accessKeyId: awsData.aws_access_key_id,
                secretAccessKey: awsData.aws_secret_access_key
              }

              //copy the data down from the old s3, then push it to the new
              db.aws.s3.copyDirFromS3ToStaging(stagingPath, credentials, username, baseBucketName, fromDirectory, function(err) {
                if (err) {
                  callback(err);
                } else {

                  db.landers.common.add_lander.addOptimizePushSave(user, stagingPath, stagingDir, landerData, function(err, data) {
                    if (err) {
                      console.log('err: ' + err);
                      callback(err);
                    } else {
                      callback(false, data);
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

  return module;

}
