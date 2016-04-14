module.exports = function(app, passport) {

  var config = require("../../config");
  var Puid = require('puid');
  var utils = require('../../utils/utils.js')();
  var db = require("../../db_api");

  var mkdirp = require("mkdirp");
  var rimraf = require("rimraf");
  var uuid = require("uuid");


  var module = {

    new: function(user, landerData, callback) {
      var me = this;

      //1. rip the lander and its resources into staging
      this.createStagingArea(function(err, stagingPath, stagingDir) {
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
              
              var fromDirectory = "/landers/" + landerData.from_s3_folder_name + "/";
              var directory = "/landers/" + landerData.s3_folder_name + "/";

              var credentials = {
                accessKeyId: awsData.aws_access_key_id,
                secretAccessKey: awsData.aws_secret_access_key
              }

              //copy the data down from the old s3, then push it to the new
              db.aws.s3.copyDirFromS3ToStaging(stagingPath, credentials, username, baseBucketName, fromDirectory, function(err) {
                if (err) {
                  callback(err);
                } else {

                  db.aws.s3.createDirectory(username, baseBucketName, directory, credentials, function(err) {
                    if (err) {
                      callback(err);
                    } else {
                      //3. copy the lander into the folder
                      db.aws.s3.copyDirFromStagingToS3(stagingPath, credentials, username, baseBucketName, directory, function(err) {
                        if (err) {
                          callback(err);
                        } else {

                          //4. remove the staging
                          me.deleteStagingArea(stagingPath, function(err) {
                            db.landers.saveNewLander(user, landerData, function(err, returnData) {
                              if (err) {
                                callback(err);
                              } else {

                                callback(false, landerData);
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
        }

      });
    },

    createStagingArea: function(callback) {
      var error;
      var staging_dir = uuid.v4();

      var staging_path = "./staging/" + staging_dir;

      mkdirp(staging_path, function(err) {
        if (err) {
          callback(err);
        } else {
          callback(false, staging_path, staging_dir);
        }
      });
    },

    deleteStagingArea: function(stagingPath, callback) {
      rimraf(stagingPath, function() {
        callback(false);
      });
    }


  };

  return module;

}
