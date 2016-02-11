module.exports = function(db) {

  var module = {};

  var s3 = require('s3');
  var AWS = require('aws-sdk');
  var uuid = require('uuid');
  var s3 = require('s3');
  var mkdirp = require('mkdirp');
  var rimraf = require('rimraf');
  var config = require('../../config');

  //create client
  // var s3_client = s3.createClient({
  //   maxAsyncS3: 20, // this is the default
  //   s3RetryCount: 3, // this is the default
  //   s3RetryDelay: 1000, // this is the default
  //   multipartUploadThreshold: 20971520, // this is the default (20 MB)
  //   multipartUploadSize: 15728640, // this is the default (15 MB)
  //   s3Options: {
  //     accessKeyId: credentials.accessKeyId,
  //     secretAccessKey: credentials.secretAccessKey,
  //     // any other options are passed to new AWS.S3()
  //     // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
  //   },
  // });

  return {

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
          if (err.code == 'BucketAlreadyExists') {
            callback('Bucket already exists.');
          } else if (err.code == 'BucketAlreadyOwnedByYou') {
            //just move along, nothing to see here
            callback('Bucket already owned by me, moving to next step');
          } else {
            console.log(err, err.stack); // an error occurred
            callback("Failure creating bucket: " + bucketName)
          }

        } else {
          console.log("successfully created bucket"); // successful response
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
          console.log(err, err.stack);
          callback("Failure deleting bucket: " + bucketName)

        } else {
          console.log("successfully configured bucket for website " + bucketName); // successful response
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

          console.log("successfully deleted bucket" + bucketName); // successful response
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
          console.log(err);
        } else {
          var buckets = data.Buckets;
          for (var i = 0; i < buckets.length; i++) {
            var bucket = buckets[i].Name;

            if (bucket.indexOf("lander-ds-") > -1) {
              returnBucketName = bucket;
              bucketExists = returnBucketName;
              console.log("bucket exists so not remaking everything")
            }
          }

          callback(bucketExists);
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
            console.log(err, err.stack); // an error occurred
          } else {
            console.log("added " + username + " snippets folder"); // successful response
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
            console.log(err, err.stack); // an error occurred
          } else {
            console.log("added " + username + " snippets folder"); // successful response
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
            console.log(err, err.stack); // an error occurred
          } else {
            console.log("added " + username + " landers folder"); // successful response
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
            console.log(err, err.stack); // an error occurred
          } else {
            console.log("added " + username + " landers folder"); // successful response
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
            console.log(err, err.stack); // an error occurred
          } else {
            console.log("added domains"); // successful response
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
                completeCallback();
              });
            });
          });
        });
      });
    },

    //makes sure that the new account user is going to use is properly set up
    createNewS3DirectoryStructureIfNotExists: function(username, buckets, credentials, callback) {

      var me = this;
      this.checkIfBucketPatternExists(credentials, "lander-ds-", function(actualBucketName) {
        if (!actualBucketName) {
          me.createBucket(credentials, buckets.newBucketName, function() {
            me.createLanderDSBaseDirectoryStructure(username, buckets.newBucketName, credentials, function() {
              callback(false);
            });
          });
        } else {
          callback(actualBucketName);
        }
      });
    },

    checkIfObjectExists: function(credentials, username, landerDsBucket, callback) {
      if (!landerDsBucket) {
        callback(false);
      }


      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });
      AWS.config.update(credentials);
      var aws_s3_client = new AWS.S3();

      var params = {
        Bucket: landerDsBucket,
        Key: username + "/"
      };
      aws_s3_client.headObject(params, function(err, data) {
        if (err) {
          if (err.code === "NotFound") {
            callback(false);
          } else {
            console.log(err, err.stack); // an error occurred
          }
        } else {
          callback(true);
          console.log(data); // successful response
        }
      });

    },

    createStagingArea: function(callback) {
      var error;
      var staging_dir = uuid.v4();

      var staging_path = "./staging/" + staging_dir;

      mkdirp(staging_path, function(err) {
        if (err) {
          console.log(err);
          error = "Server error making staging directory."
        } else {
          callback(staging_path, error);
        }
      });
    },

    removeStagingArea: function(stagingPath, callback) {
      rimraf(stagingPath, function() {
        callback();
      });
    },

    copyDirFromStagingToS3: function(stagingPath, credentials, username, bucketName, callback) {
      var s3_client = s3.createClient({
        maxAsyncS3: 20, // this is the default
        s3RetryCount: 0, // this is the default
        s3RetryDelay: 1000, // this is the default
        multipartUploadThreshold: 20971520, // this is the default (20 MB)
        multipartUploadSize: 15728640, // this is the default (15 MB)
        s3Options: {
          accessKeyId: credentials.accessKeyId,
          secretAccessKey: credentials.secretAccessKey,
          region: config.awsRegion
        }
      });

      var params = {
        localDir: stagingPath,
        deleteRemoved: false,

        s3Params: {
          Bucket: bucketName,
          Prefix: username
        }
      };

      var uploader = s3_client.uploadDir(params);

      uploader.on("end", function() {
        callback();
      });

    },

    copyDirFromS3ToStaging: function(stagingPath, credentials, username, bucketName, callback) {
      var s3_client = s3.createClient({
        maxAsyncS3: 20, // this is the default
        s3RetryCount: 0, // this is the default
        s3RetryDelay: 1000, // this is the default
        multipartUploadThreshold: 20971520, // this is the default (20 MB)
        multipartUploadSize: 15728640, // this is the default (15 MB)
        s3Options: {
          accessKeyId: credentials.accessKeyId,
          secretAccessKey: credentials.secretAccessKey,
          region: config.awsRegion
        }
      });

      var params = {
        localDir: stagingPath,
        deleteRemoved: false,

        s3Params: {
          Bucket: bucketName,
          Prefix: username
        }
      };

      var downloader = s3_client.downloadDir(params);

      downloader.on('end', function() {
        callback();
      });

    },

    backupAndMoveUserFolder: function(oldCredentials, newCredentials, buckets, username, callback) {
      if (!buckets.oldBucketName || !buckets.newBucketName) {
        callback(false);
      }
      var me = this;

      this.createStagingArea(function(stagingPath) {
        console.log("made staging dir " + stagingPath);

        me.copyDirFromS3ToStaging(stagingPath, oldCredentials, username, buckets.oldBucketName, function() {
          console.log("successfully downloaded dir to staging");

          me.copyDirFromStagingToS3(stagingPath, newCredentials, username, buckets.newBucketName, function() {
            console.log("successfully uploaded dir from staging");

            me.removeStagingArea(stagingPath, function() {
              console.log("successfully deleted staging dir");
              callback();
            });
          });
        });
      });
    },

    backupUserFolderMoveToNewAccountIfNeeded: function(oldCredentials, newCredentials, username, buckets, callback) {
      if (!buckets.oldBucketName || !buckets.newBucketName) {
        callback(false);
      }
      //if old user folder exists back up and move
      var me = this;

      //back it up if we have something to back up
      this.checkIfObjectExists(oldCredentials, username, buckets.oldBucketName, function(objectExists) {
        if (objectExists) {
          console.log("backing up..");
          //back it up and move it

          me.backupAndMoveUserFolder(oldCredentials, newCredentials, buckets, username, function() {
            callback();
          });

        } else {
          callback();
        }
      });

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
      this.createNewS3DirectoryStructureIfNotExists(username, buckets, newCredentials, function(newBucketName) {
        console.log("done with creating dir structure");

        if (newBucketName) {
          buckets.newBucketName = newBucketName;
        }

        console.log("HERE buckets: " + JSON.stringify(buckets));

        me.backupUserFolderMoveToNewAccountIfNeeded(oldCredentials, newCredentials, username, buckets, function() {
          callback(newBucketName);
        });
      });
    }

  }
}
