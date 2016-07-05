module.exports = function(db) {

  var optimize_lander = require("./optimize_lander")(db);
  var dbAws = require('../../aws')(db);


  return {

    addOptimizePushSave: function(user, stagingDir, landerData, callback) {


      //4. createDirectory in s3 for optimized
      //5. push optimized
      //6. pagespeed test endpoints (deployed endpoints, original and optimized)
      //7. save lander into DB, save endpoints into DB (create stored proc for this?)
      var stagingPath = "staging/" + stagingDir;


      //1. createDirectory in s3 for original
      //2. push original to s3
      var pushOriginalLanderToS3 = function(awsData, callback) {

        var directory = "/landers/" + stagingDir + "/";
        var username = user.user;
        var fullDirectory = username + directory;
        var baseBucketName = awsData.aws_root_bucket;

        var credentials = {
          accessKeyId: awsData.aws_access_key_id,
          secretAccessKey: awsData.aws_secret_access_key
        }

        dbAws.s3.createDirectory(username, baseBucketName, directory, credentials, function(err) {
          if (err) {
            callback(err);
          } else {

            //3. copy the lander into the folder
            dbAws.s3.copyDirFromStagingToS3(stagingPath, credentials, username, baseBucketName, fullDirectory, function(err) {
              if (err) {
                callback(err);
              } else {
                callback(false);
              }
            });
          }
        });

      };


      //logic begins here
      dbAws.keys.getAmazonApiKeysAndRootBucket(user, function(err, awsData) {
        if (err) {
          callback(err);
        } else {
          pushOriginalLanderToS3(awsData, function(err) {
            if (err) {
              callback(err);
            } else {
              //3. optimize the staging directory
              optimize_lander.fullyOptimize("staging/" + stagingDir, function(err) {
                if (err) {
                  callback(err);
                } else {
                  //4. push optimized to s3

                  console.log("TREV: lander fully optimized");

                }
              });
              



            }
          });
        }
      });


    }
  }
}
