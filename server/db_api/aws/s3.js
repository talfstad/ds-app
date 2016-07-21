module.exports = function(app, db) {

  var module = {};

  var s3 = require('s3');
  var AWS = require('aws-sdk');
  var uuid = require('uuid');
  var mkdirp = require('mkdirp');
  var path = require('path');

  return {

    deleteDir: function(credentials, bucketName, dirPath, callback) {
      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });
      AWS.config.update(credentials);

      var s3_client = s3.createClient({
        maxAsyncS3: 20, // this is the default
        s3RetryCount: 0, // this is the default
        s3RetryDelay: 1000, // this is the default
        multipartUploadThreshold: 20971520, // this is the default (20 MB)
        multipartUploadSize: 15728640, // this is the default (15 MB)
        s3Options: {
          accessKeyId: credentials.accessKeyId,
          secretAccessKey: credentials.secretAccessKey,
          region: app.config.awsRegion,
        }
      });

      var params = {
        Bucket: bucketName,
        Prefix: dirPath
      };

      var deleteDirAction = s3_client.deleteDir(params);
      deleteDirAction.on("error", function(err) {
        callback(err);
      });
      deleteDirAction.on("end", function() {
        callback();
      });

    },


    // 1. Bucket names must be at least 3 and no more than 63 characters long.
    // 2. Bucket names must be a series of one or more labels. Adjacent labels are 
    //separated by a single period (.). Bucket names can contain lowercase letters, 
    //numbers, and hyphens. Each label must start and end with a lowercase letter or a number.
    // 3. Bucket names must not be formatted as an IP address (e.g., 192.168.5.4).
    // 4. When using virtual hosted–style buckets with SSL, the SSL wild card certificate 
    //only matches buckets that do not contain periods. To work around this, use HTTP or write 
    //your own certificate verification logic.
    createBucket: function(credentials, bucketName, callback) {

      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });
      AWS.config.update(credentials);

      var aws_s3_client = new AWS.S3();

      var params = {
        Bucket: bucketName,
        ACL: "public-read"
      };

      aws_s3_client.createBucket(params, function(err, data) {
        if (err) {
          callback(err);
        } else {
          // console.log("successfully created bucket"); // successful response
          callback(false, data);
        }
      });

    },

    //creates the website configuration for a bucket
    createBucketWebsite: function(credentials, bucketName, callback) {

      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });
      AWS.config.update(credentials);

      var aws_s3_client = new AWS.S3();

      var params = {
        Bucket: bucketName,
        /* required */
        WebsiteConfiguration: { /* required */
          ErrorDocument: {
            Key: 'error.html' /* required */
          },
          IndexDocument: {
            Suffix: 'index.html' /* required */
          },
        }
      };

      aws_s3_client.putBucketWebsite(params, function(err, data) {
        if (err) {
          callback(err);
        } else {
          // console.log("successfully configured bucket for website " + bucketName); // successful response
          callback(false, data);
        }
      });

    },

    deleteBucket: function(credentials, bucketName, callback) {

      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });
      AWS.config.update(credentials);

      var aws_s3_client = new AWS.S3();

      var params = {
        Bucket: bucketName
      };

      aws_s3_client.deleteBucket(params, function(err, data) {
        if (err) {
          console.log(err, err.stack); // an error occurred
          callback(err)
        } else {
          // console.log("successfully deleted bucket" + bucketName); // successful response
          callback(false, data);
        }
      });
    },

    checkIfBucketExists: function(credentials, bucketName, callback) {
      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });
      AWS.config.update(credentials);
      var aws_s3_client = new AWS.S3();

      //0. create new accounts directory structure if not created including user folder
      //a. check to see if lander-ds bucket exists
      var params = {
        Bucket: bucketName /* required */
      };

      aws_s3_client.headBucket(params, function(err, data) {
        if (err) {
          if (err.code === "NotFound") {
            callback(false);
          } else if (err.code === "NoSuchBucket") {
            callback(false);
          } else {
            callback(false);
          }
        } else {
          callback(true);
        }
      });
    },


    //checks bucket pattern and returns the actual bucket
    checkIfBucketPatternExists: function(credentials, bucketName, callback) {
      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });
      AWS.config.update(credentials);
      var aws_s3_client = new AWS.S3();

      //0. create new accounts directory structure if not created including user folder
      //a. check to see if lander-ds bucket exists
      var bucketExists = false;

      aws_s3_client.listBuckets(function(err, data) {
        if (err) {
          callback(err);
        } else {
          var buckets = data.Buckets;
          for (var i = 0; i < buckets.length; i++) {
            var bucket = buckets[i].Name;

            if (bucket.indexOf("lander-ds-") > -1) {
              returnBucketName = bucket;
              bucketExists = returnBucketName;
              // console.log("bucket exists so not remaking everything")
            }
          }

          callback(false, bucketExists);
        }
      });
    },

    addNewDomainFolderToS3: function(credentials, baseBucketName, key, callback) {
      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });
      AWS.config.update(credentials);
      var aws_s3_client = new AWS.S3();

      var params = {
        Bucket: baseBucketName,
        Key: key,
        ACL: 'bucket-owner-full-control'
      };
      aws_s3_client.putObject(params, function(err, data) {
        if (err) {
          completeCallback(err);
        } else {
          callback();
        }
      });
    },

    deleteDomainFromS3: function(domain, baseBucketName, credentials, callback) {
      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });
      AWS.config.update(credentials);
      var aws_s3_client = new AWS.S3();

      var params = {
        Bucket: baseBucketName,
        Key: 'domains/' + domain + '/'
      };
      aws_s3_client.deleteObject(params, function(err, data) {
        if (err) {
          callback(err);
        } else {
          // console.log("added " + username + " snippets folder"); // successful response
          callback();
        }
      });
    },

    createDirectory: function(username, baseBucketName, folder, credentials, callback) {
      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });
      AWS.config.update(credentials);
      var aws_s3_client = new AWS.S3();

      var params = {
        Bucket: baseBucketName,
        Key: username + folder,
        ACL: 'bucket-owner-full-control'
      };

      aws_s3_client.putObject(params, function(err, data) {
        if (err) {
          callback(err);
        } else {
          callback(false);
        }
      });

    },

    createLanderDSBaseDirectoryStructure: function(username, baseBucketName, credentials, completeCallback) {
      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });
      AWS.config.update(credentials);
      var aws_s3_client = new AWS.S3();

      var addUserSnippetsResourcesFolder = function(callback) {
        var params = {
          Bucket: baseBucketName,
          Key: username + '/snippets/resources/',
          ACL: 'bucket-owner-full-control'
        };
        aws_s3_client.putObject(params, function(err, data) {
          if (err) {
            completeCallback(err);
          } else {
            // console.log("added " + username + " snippets folder"); // successful response
            callback();
          }
        });
      };

      var addUserSnippetsFolder = function(callback) {
        var params = {
          Bucket: baseBucketName,
          Key: username + '/snippets/',
          ACL: 'bucket-owner-full-control'
        };
        aws_s3_client.putObject(params, function(err, data) {
          if (err) {
            completeCallback(err);
          } else {
            // console.log("added " + username + " snippets folder"); // successful response
            callback();
          }
        });
      };

      var addUserLandersFolder = function(callback) {
        var params = {
          Bucket: baseBucketName,
          Key: username + '/landers/',
          ACL: 'bucket-owner-full-control'
        };
        aws_s3_client.putObject(params, function(err, data) {
          if (err) {
            completeCallback(err);
          } else {
            // console.log("added " + username + " landers folder"); // successful response
            callback();
          }
        });
      };

      var addUserFolder = function(callback) {
        var params = {
          Bucket: baseBucketName,
          Key: username + '/',
          ACL: 'bucket-owner-full-control'
        };
        aws_s3_client.putObject(params, function(err, data) {
          if (err) {
            completeCallback(err);
          } else {
            // console.log("added " + username + " landers folder"); // successful response
            callback();
          }
        });
      };

      var addDomainsFolder = function(callback) {
        //add domains
        var params = {
          Bucket: baseBucketName,
          Key: 'domains/',
          ACL: 'bucket-owner-full-control'
        };
        aws_s3_client.putObject(params, function(err, data) {
          if (err) {
            completeCallback(err);
          } else {
            // console.log("added domains"); // successful response
            callback();
          }
        });
      };

      //dir structure:
      //    - domains /
      //    - trevor@buildcave.com /
      //      - snippets /
      //        - resources /
      //      - landers /

      ///TODO Get the user's email value here
      addDomainsFolder(function() {
        addUserFolder(function() {
          addUserSnippetsFolder(function() {
            addUserSnippetsResourcesFolder(function() {
              addUserLandersFolder(function() {
                completeCallback(false);
              });
            });
          });
        });
      });
    },

    //makes sure that the new account user is going to use is properly set up
    createNewS3DirectoryStructureIfNotExists: function(username, buckets, credentials, callback) {

      var me = this;
      this.checkIfBucketPatternExists(credentials, "lander-ds-", function(err, actualBucketName) {
        if (err) {
          callback(err);
        } else {
          if (!actualBucketName) {
            me.createBucket(credentials, buckets.newBucketName, function(err) {
              if (err) {
                callback(err);
              } else {
                me.createBucketWebsite(credentials, buckets.newBucketName, function(err, data) {
                  if (err) {
                    callback(err);
                  } else {
                    me.createLanderDSBaseDirectoryStructure(username, buckets.newBucketName, credentials, function(err) {
                      if (err) {
                        callback(err);
                      } else {
                        callback(false, false);
                      }
                    });
                  }
                });
              }
            });
          } else {
            callback(false, actualBucketName);
          }
        }
      });
    },

    checkIfObjectExists: function(credentials, username, bucket, callback) {
      if (!bucket) {
        //no error if we pass a null string cuz the bucket doesn't exist
        callback(false, false);
      } else {
        AWS.config.update({
          region: 'us-west-2',
          maxRetries: 0
        });
        AWS.config.update(credentials);
        var aws_s3_client = new AWS.S3();

        var params = {
          Bucket: bucket,
          Key: username + "/"
        };
        aws_s3_client.headObject(params, function(err, data) {
          if (err) {
            if (err.code === "NotFound") {
              callback(false, false);
            } else {
              callback(err, false);
            }
          } else {
            callback(false, true);
          }
        });
      }
    },

    copyGzippedDirFromStagingToS3: function(stagingPath, credentials, username, bucketName, directory, callback) {
      console.log("in copy copyGzippedDirFromStagingToS3")
      var fullDir;
      if (directory) {
        fullDir = directory;
      } else {
        fullDir = username;
      }

      console.log("full dir: " + fullDir);

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
          region: app.config.awsRegion,
        }
      });

      // var updateContentEncodingForNoGzipKeys = function(noGzipListKeys, callback) {
      //   console.log("in update content encoding type for no gzip keys" + JSON.stringify(noGzipListKeys));
      //   var asyncIndex = 0;
      //   for (var i = 0; i < noGzipListKeys.length; i++) {
      //     var key = noGzipListKeys[i];
      //     var copySource = encodeURI(bucketName + "/" + key);

      //     console.log("copy source: " + copySource);

      //     var params = {
      //       Bucket: bucketName,
      //       CopySource: copySource,
      //       Key: key,
      //       MetadataDirective: 'REPLACE',
      //       ACL: "public-read",
      //       CacheControl: 'max-age=604800',
      //       Expires: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
      //     };

      //     aws_s3_client.copyObject(params, function(err, data) {
      //       if (err) {
      //         console.log("ERROR COPYOBJ: " + err);
      //         callback(err);
      //       } else {
      //         if (++asyncIndex == noGzipListKeys.length) {
      //           console.log("updated all gzip fixes\n\n" + JSON.stringify(data))
      //           callback(false);
      //         }
      //       }
      //     });
      //   }
      //   if (noGzipListKeys.length <= 0) {
      //     console.log("no gzip keys to update");
      //     callback(false);
      //   }
      // };

      var updateContentEncodingForNoGzipKey = function(s3Key, callback) {
        console.log("in update content encoding type for no gzip keys");
        var copySource = encodeURI(bucketName + "/" + s3Key);

        console.log("copy source: " + copySource);

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
            console.log("ERROR COPYOBJ: " + err);
            callback(err);
          } else {
            console.log("updated all gzip fixes\n\n" + JSON.stringify(data))
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
          Expires: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
          ContentEncoding: "gzip"
        }
      };


      var uploader = s3_client.uploadDir(params);
      uploader.on("error", function(err) {
        console.log("TTT ERROR!!! " + err);
        callback(err);
      });

      uploader.on('fileUploadEnd', function(localFilePath, s3Key) {
        //get the key push it on an arr of things to change the content encoding on after
        var ext = localFilePath.split('.').pop();

        console.log("in upload end, endpoints to have" + JSON.stringify(app.config.noGzipArr));
        console.log("local file path: " + ext);
        console.log("extension: " + localFilePath);

        if (app.config.noGzipArr.indexOf(ext) > -1) {
          updateContentEncodingForNoGzipKey(s3Key, function() {
            //nothing for callback needed
            console.log("updated " + s3Key + " successfully");
          });
        }
      });
      uploader.on("end", function() {
        callback();
      });

    },

    copyDirFromStagingToS3: function(stagingPath, credentials, username, bucketName, directory, callback) {
      var fullDir;
      if (directory) {
        fullDir = directory;
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
          region: app.config.awsRegion,
        }
      });

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

      var uploader = s3_client.uploadDir(params);
      uploader.on("error", function(err) {
        callback(err);
      });
      uploader.on("end", function() {
        callback();
      });

    },

    copyDirFromS3ToStaging: function(stagingPath, credentials, username, bucketName, directory, callback) {
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
        callback(err);
      });
      downloader.on('end', function() {
        callback();
      });

    },

    //gets old folder and moves it to the new one...
    backupAndMoveUserFolder: function(oldCredentials, newCredentials, buckets, username, callback) {
      if (!buckets.oldBucketName || !buckets.newBucketName) {
        callback(false);
      } else {
        var me = this;

        db.common.createStagingArea(function(stagingPath) {
          // console.log("made staging dir " + stagingPath);

          me.copyDirFromS3ToStaging(stagingPath, oldCredentials, username, buckets.oldBucketName, function(err) {
            if (err) {
              callback(err);
            } else {
              // console.log("successfully downloaded dir to staging");

              me.copyDirFromStagingToS3(stagingPath, newCredentials, username, buckets.newBucketName, null, function(err) {
                if (err) {
                  callback(err);
                } else {
                  // console.log("successfully uploaded dir from staging");
                  db.common.deleteStagingArea(stagingPath, function() {
                    // console.log("successfully deleted staging dir");
                    callback();
                  });
                }
              });
            }
          });
        });
      }
    },

    backupUserFolderMoveToNewAccountIfNeeded: function(oldCredentials, newCredentials, username, buckets, callback) {
      if (!buckets.oldBucketName) {
        callback(false, false);
      } else if (!buckets.newBucketName) {
        callback({
          code: "NoNewBucketsSpecified"
        });
      } else {
        //if old user folder exists back up and move
        var me = this;

        //back it up if we have something to back up
        this.checkIfObjectExists(oldCredentials, username, buckets.oldBucketName, function(err, objectExists) {
          if (err) {
            callback(err);
          } else {
            if (objectExists) {
              // console.log("backing up..");
              //back it up and move it
              me.backupAndMoveUserFolder(oldCredentials, newCredentials, buckets, username, function(err) {
                if (err) {
                  callback(err);
                } else {
                  callback(false, false);
                }
              });

            } else {
              // console.log("nothing to backup no folder found")
              callback(false, false);
            }
          }
        });
      }

    },

    //used when a user changes AWS accounts. Makes sure that the user's data is moved to the new account correctly
    copyUserFolderToNewAccount: function(oldCredentials, newCredentials, currentRootBucket, user, callback) {
      var me = this;

      var username = user.user;

      var bucket_uuid = uuid.v4();
      var newBucketName = "lander-ds-" + bucket_uuid;

      var buckets = {
        oldBucketName: currentRootBucket,
        newBucketName: newBucketName
      };
      this.createNewS3DirectoryStructureIfNotExists(username, buckets, newCredentials, function(err, newBucketName) {
        if (err) {
          callback(err);
        } else {
          if (newBucketName) {
            buckets.newBucketName = newBucketName;
          }

          me.backupUserFolderMoveToNewAccountIfNeeded(oldCredentials, newCredentials, username, buckets, function(err) {
            if (err) {
              console.log("backing up user data error: " + JSON.stringify(err));
              callback(err);
            } else {
              callback(false, buckets.newBucketName);
            }
          });
        }
      });
    }

  }
}
