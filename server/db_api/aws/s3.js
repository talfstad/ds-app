module.exports = function(app, db) {

  var module = {};

  var s3 = require('s3');
  var AWS = require('aws-sdk');
  var uuid = require('uuid');
  var mkdirp = require('mkdirp');
  var path = require('path');

  var dbCommon = require('../common')(db);
  var awsCommon = require('./common')(app, db);

  return {

    getObject: function(lander_id, credentials, bucketName, key, callback) {

      var releaseLockAndCallback = function(err, data) {
        awsCommon.releaseLockForS3(lander_id, function() {
          if (err) {
            callback(err);
          } else {
            callback(false, data);
          }
        });
      };

      awsCommon.getLockForS3(lander_id, function(err) {
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

      var releaseLockAndCallback = function(err, data) {
        awsCommon.releaseLockForS3(lander_id, function() {
          if (err) {
            callback(err);
          } else {
            callback(false, data);
          }
        });
      };

      awsCommon.getLockForS3(lander_id, function(err) {
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

    //don't need lock because this is only called for domain directories
    //and is only called when deployment folders changed which we can always just delete cuz fuck it
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

      if (dirPath) {
        var deleteDirAction = s3_client.deleteDir(params);
        deleteDirAction.on("error", function(err) {
          app.log("ERROR deleting dir from s3", "debug");
          callback(err);
        });
        deleteDirAction.on("end", function() {
          app.log("DELETED DIR : " + bucketName + " : dir : " + dirPath, "debug");
          callback(false);
        });
      } else {
        callback(false);
      }
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
          app.log("successfully configured bucket for website " + bucketName, "debug"); // successful response
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
          callback(err)
        } else {
          app.log("successfully deleted bucket" + bucketName, "debug"); // successful response
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
              app.log("bucket exists so not remaking everything", "debug");
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
          app.log("added " + username + " snippets folder", "debug"); // successful response
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
            app.log("added " + username + " snippets folder", "debug"); // successful response
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
            app.log("added " + username + " snippets folder", "debug"); // successful response
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
            app.log("added " + username + " landers folder", "debug"); // successful response
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
            app.log("added " + username + " landers folder", "debug"); // successful response
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
            app.log("added domains", "debug"); // successful response
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

    checkIfDirectoryExists: function(credentials, username, bucket, folderPathToCheck, callback) {
      if (!bucket) {
        //no error if we pass a null string cuz the bucket doesn't exist
        callback(false, false);
      } else {
        var fullDir;
        if (folderPathToCheck) {
          fullDir = folderPathToCheck;
        } else {
          fullDir = username;
        }

        app.log("checking if directory exists: " + bucket + " folder: " + folderPathToCheck, "debug");

        AWS.config.update({
          region: 'us-west-2',
          maxRetries: 0
        });
        AWS.config.update(credentials);
        var aws_s3_client = new AWS.S3();

        var params = {
          Bucket: bucket,
          Prefix: fullDir
        };


        aws_s3_client.listObjects(params, function(err, data) {
          if (err) {
            if (err.code === "NotFound") {
              callback(false, false);
            } else {
              callback(err, false);
            }
          } else {
            var exists = (data.Contents.length > 0);
            callback(false, exists);
          }
        });
      }
    },

    checkIfObjectExists: function(credentials, username, bucket, folderPathToCheck, callback) {
      if (!bucket) {
        //no error if we pass a null string cuz the bucket doesn't exist
        callback(false, false);
      } else {
        var fullDir;
        if (folderPathToCheck) {
          fullDir = folderPathToCheck;
        } else {
          fullDir = username;
        }

        app.log("checking if object exists: " + bucket + " folder: " + folderPathToCheck, "debug");

        AWS.config.update({
          region: 'us-west-2',
          maxRetries: 0
        });
        AWS.config.update(credentials);
        var aws_s3_client = new AWS.S3();

        var params = {
          Bucket: bucket,
          Key: fullDir
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

    copyDirFromStagingToS3: function(lander_id, isGzipped, stagingPath, credentials, username, bucketName, directory, callback) {

      var releaseLockAndCallback = function(err, data) {
        awsCommon.releaseLockForS3(lander_id, function() {
          if (err) {
            callback(err);
          } else {
            callback(false, data);
          }
        });
      };

      awsCommon.getLockForS3(lander_id, function(err) {
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
              region: app.config.awsRegion,
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

    // copyDirFromStagingToS3: function(stagingPath, credentials, username, bucketName, directory, callback) {
    //   var fullDir;
    //   if (directory) {
    //     fullDir = directory;
    //   } else {
    //     fullDir = username;
    //   }

    //   var s3_client = s3.createClient({
    //     maxAsyncS3: 20, // this is the default
    //     s3RetryCount: 0, // this is the default
    //     s3RetryDelay: 1000, // this is the default
    //     multipartUploadThreshold: 20971520, // this is the default (20 MB)
    //     multipartUploadSize: 15728640, // this is the default (15 MB)
    //     s3Options: {
    //       accessKeyId: credentials.accessKeyId,
    //       secretAccessKey: credentials.secretAccessKey,
    //       region: app.config.awsRegion,
    //     }
    //   });

    //   var params = {
    //     localDir: stagingPath,
    //     deleteRemoved: false,

    //     s3Params: {
    //       Bucket: bucketName,
    //       Prefix: fullDir,
    //       ACL: 'public-read',
    //       CacheControl: 'max-age=604800',
    //       Expires: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789
    //     }
    //   };

    //   var uploader = s3_client.uploadDir(params);
    //   uploader.on("error", function(err) {
    //     callback(err);
    //   });
    //   uploader.on("end", function() {
    //     callback();
    //   });

    // },

    copyDirFromS3ToStaging: function(lander_id, stagingPath, credentials, username, bucketName, directory, callback) {

      var releaseLockAndCallback = function(err, data) {
        awsCommon.releaseLockForS3(lander_id, function() {
          if (err) {
            callback(err);
          } else {
            callback(false, data);
          }
        });
      };

      awsCommon.getLockForS3(lander_id, function(err) {
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

    //gets old folder and moves it to the new one...
    backupAndMoveUserFolder: function(oldCredentials, newCredentials, buckets, username, callback) {

      if (!buckets.oldBucketName || !buckets.newBucketName) {
        callback(false);
      } else {
        var me = this;

        dbCommon.createStagingArea(function(err, stagingPath) {
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
                  dbCommon.deleteStagingArea(stagingPath, function(err) {
                    app.log("successfully deleted staging dir", "debug");
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
        var folderPathToCheck = null;
        this.checkIfObjectExists(oldCredentials, username, buckets.oldBucketName, folderPathToCheck, function(err, objectExists) {
          if (err) {
            callback(err);
          } else {
            if (objectExists) {
              app.log("backing up..", "debug");
              //back it up and move it
              me.backupAndMoveUserFolder(oldCredentials, newCredentials, buckets, username, function(err) {
                if (err) {
                  callback(err);
                } else {
                  callback(false, false);
                }
              });

            } else {
              app.log("nothing to backup no folder found", "debug");
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
