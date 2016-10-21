module.exports = function(app, dbApi) {

  var base = require("./base")(app);

  var s3 = require('s3');
  var AWS = require('aws-sdk');
  var path = require('path');

  var module = _.extend({
    copyDirFromS3ToStaging: function(lander_id, stagingPath, credentials, username, bucketName, directory, callback) {

      var releaseLockAndCallback = function(err, data) {
        dbApi.aws.common.releaseLockForS3(lander_id, function() {
          if (err) {
            callback(err);
          } else {
            callback(false, data);
          }
        });
      };

      dbApi.aws.common.getLockForS3(lander_id, function(err) {
        if (err) {
          callback(err);
        } else {
          var fullDir;
          if (directory) {
            fullDir = path.join(username, directory);
          } else {
            fullDir = username;
          }

          var s3_client = s3.createClient({
            maxAsyncS3: 20, // this is the default
            s3RetryCount: 0, // this is the default
            s3RetryDelay: 1000, // this is the default
            multipartUploadThreshold: 20971520, // this is the default (20 MB)
            multipartUploadSize: 15728640, // this is the default (15 MB)
            s3Options: {
              accessKeyId: credentials.accessKeyId,
              secretAccessKey: credentials.secretAccessKey,
              region: app.config.awsRegion
            }
          });

          var params = {
            localDir: stagingPath,
            deleteRemoved: false,

            s3Params: {
              Bucket: bucketName,
              Prefix: fullDir
            }
          };

          var downloader = s3_client.downloadDir(params);
          downloader.on("error", function(err) {
            releaseLockAndCallback(err);
          });
          downloader.on('end', function() {
            releaseLockAndCallback();
          });
        }
      });
    },

    copyDirFromStagingToS3: function(lander_id, isGzipped, stagingPath, credentials, username, bucketName, directory, callback) {

      var releaseLockAndCallback = function(err, data) {
        dbApi.aws.common.releaseLockForS3(lander_id, function() {
          if (err) {
            callback(err);
          } else {
            callback(false, data);
          }
        });
      };

      dbApi.aws.common.getLockForS3(lander_id, function(err) {
        if (err) {
          callback(err);
        } else {
          app.log("in copy copyGzippedDirFromStagingToS3", "debug");
          var fullDir;
          if (directory) {
            fullDir = directory;
          } else {
            fullDir = username;
          }

          app.log("full dir: " + fullDir, "debug");

          AWS.config.update({
            region: 'us-west-2',
            maxRetries: 0
          });
          AWS.config.update(credentials);

          var aws_s3_client = new AWS.S3();

          var s3_client = s3.createClient({
            maxAsyncS3: 20, // this is the default
            s3RetryCount: 0, // this is the default
            s3RetryDelay: 1000, // this is the default
            multipartUploadThreshold: 20971520, // this is the default (20 MB)
            multipartUploadSize: 15728640, // this is the default (15 MB)
            s3Options: {
              accessKeyId: credentials.accessKeyId,
              secretAccessKey: credentials.secretAccessKey,
              region: app.config.awsRegion
            }
          });

          var updateContentEncodingForNoGzipKey = function(s3Key, callback) {
            app.log("in update content encoding type for no gzip keys", "debug");
            var copySource = encodeURI(bucketName + "/" + s3Key);

            app.log("copy source: " + copySource, "debug");

            var params = {
              Bucket: bucketName,
              CopySource: copySource,
              Key: s3Key,
              MetadataDirective: 'REPLACE',
              ACL: "public-read",
              CacheControl: 'max-age=604800',
              Expires: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
            };

            aws_s3_client.copyObject(params, function(err, data) {
              if (err) {
                callback(err);
              } else {
                callback(false);
              }
            });

          };

          var params = {
            localDir: stagingPath,
            deleteRemoved: false,

            s3Params: {
              Bucket: bucketName,
              Prefix: fullDir,
              ACL: 'public-read',
              CacheControl: 'max-age=604800',
              Expires: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789
            }
          };

          if (isGzipped) {
            params.s3Params.ContentEncoding = "gzip";
          }


          var uploader = s3_client.uploadDir(params);
          uploader.on("error", function(err) {
            releaseLockAndCallback(err);
          });

          uploader.on('fileUploadEnd', function(localFilePath, s3Key) {
            if (isGzipped) {
              //get the key push it on an arr of things to change the content encoding on after
              var ext = localFilePath.split('.').pop();

              if (app.config.noGzipArr.indexOf(ext) > -1) {
                updateContentEncodingForNoGzipKey(s3Key, function(err) {
                  if (err) {
                    releaseLockAndCallback(err);
                  }
                  //nothing for callback needed
                });
              }
            }
          });
          uploader.on("end", function() {
            releaseLockAndCallback();
          });
        }
      });
    },

    getObject: function(lander_id, credentials, bucketName, key, callback) {

      var releaseLockAndCallback = function(err, data) {
        dbApi.aws.common.releaseLockForS3(lander_id, function() {
          if (err) {
            callback(err);
          } else {
            callback(false, data);
          }
        });
      };

      dbApi.aws.common.getLockForS3(lander_id, function(err) {
        if (err) {
          callback(err);
        } else {
          AWS.config.update({
            region: 'us-west-2',
            maxRetries: 0
          });
          AWS.config.update(credentials);

          var aws_s3_client = new AWS.S3();

          var params = {
            Bucket: bucketName,
            Key: key
          };

          aws_s3_client.getObject(params, function(err, data) {
            if (err) {
              releaseLockAndCallback(err);
            } else {
              releaseLockAndCallback(false, data);
            }
          });
        }
      });
    },

    putObject: function(lander_id, credentials, bucketName, key, body, callback) {
      //lander_id is optional

      var releaseLockAndCallback = function(err, data) {
        dbApi.aws.common.releaseLockForS3(lander_id, function() {
          if (err) {
            callback(err);
          } else {
            callback(false, data);
          }
        });
      };

      dbApi.aws.common.getLockForS3(lander_id, function(err) {
        if (err) {
          callback(err);
        } else {
          AWS.config.update({
            region: 'us-west-2',
            maxRetries: 0
          });
          AWS.config.update(credentials);

          var aws_s3_client = new AWS.S3();

          var params = {
            Bucket: bucketName,
            Key: key,
            ACL: "public-read",
            CacheControl: 'max-age=604800',
            ContentType: 'text/html',
            Expires: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
            Body: body
          };

          aws_s3_client.putObject(params, function(err, data) {
            if (err) {
              releaseLockAndCallback(err);
            } else {
              releaseLockAndCallback(false, data);
            }
          });
        }
      });
    },

    //gets old folder and moves it to the new one...
    backupAndMoveUserFolder: function(oldCredentials, newCredentials, buckets, username, callback) {

      if (!buckets.oldBucketName || !buckets.newBucketName) {
        callback(false);
      } else {
        var me = this;

        dbApi.common.createStagingArea(function(err, stagingPath) {
          me.copyDirFromS3ToStaging(false, stagingPath, oldCredentials, username, buckets.oldBucketName, null, function(err) {
            if (err) {
              callback(err);
            } else {
              app.log("successfully downloaded dir to staging", "debug");

              me.copyDirFromStagingToS3(false, false, stagingPath, newCredentials, username, buckets.newBucketName, null, function(err) {
                if (err) {
                  callback(err);
                } else {
                  app.log("successfully uploaded dir from staging", "debug");
                  dbApi.common.deleteStagingArea(stagingPath, function(err) {
                    app.log("successfully deleted staging dir", "debug");
                    callback();
                  });
                }
              });
            }
          });
        });
      }
    }
  }, base);

  return module;
};
