module.exports = function(db) {

  var optimize_lander = require("./optimize_lander")(db);
  var dbAws = require('../../aws')(db);
  var dbCommon = require('../../common')(db);

  return {

    addOptimizePushSave: function(user, localStagingPath, s3_folder_name, landerData, callback) {


      //4. createDirectory in s3 for optimized
      //5. push optimized
      //6. pagespeed test endpoints (deployed endpoints, original and optimized)
      //7. save lander into DB, save endpoints into DB (create stored proc for this?)
      var remoteStagingPath = "/landers/" + s3_folder_name + "/"

      //1. createDirectory in s3 for original
      //2. push original to s3
      var pushLanderToS3 = function(directory, awsData, callback) {
        var username = user.user;
        var fullDirectory = username + directory;
        var baseBucketName = awsData.aws_root_bucket;

        var credentials = {
          accessKeyId: awsData.aws_access_key_id,
          secretAccessKey: awsData.aws_secret_access_key
        }
        dbAws.s3.copyDirFromStagingToS3(localStagingPath, credentials, username, baseBucketName, fullDirectory, function(err) {
          if (err) {
            callback(err);
          } else {
            callback(false);
          }
        });
      };

      var saveLanderToDb = function(callback) {
        var user_id = user.id;
        var modelAttributes = {};

        //param order: working_node_id, action, alternate_action, processing, lander_id, domain_id, campaign_id, user_id
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("CALL save_new_lander(?, ?, ?, ?)", [landerData.name, '', s3_folder_name, user_id],
              function(err, docs) {
                if (err) {
                  callback(err);
                } else {

                  landerData.created_on = docs[1][0]["created_on"];
                  landerData.id = docs[0][0]["LAST_INSERT_ID()"];

                  callback(false);
                }
                connection.release();
              });
          }
        });
      };

      //logic begins here
      dbAws.keys.getAmazonApiKeysAndRootBucket(user, function(err, awsData) {
        if (err) {
          callback(err);
        } else {
          var directory = "/landers/" + s3_folder_name + "/original/";
          pushLanderToS3(directory, awsData, function(err) {
            if (err) {
              callback(err);
            } else {
              //3. optimize the staging directory
              optimize_lander.fullyOptimize("staging/" + s3_folder_name, function(err) {
                if (err) {
                  callback(err);
                } else {
                  //4. push optimized to s3
                  var directory = "/landers/" + s3_folder_name + "/optimized/";

                  pushLanderToS3(directory, awsData, function(err) {
                    if (err) {
                      callback(err);
                    } else {

                      //4. remove local staging
                      dbCommon.deleteStagingArea("staging/" + s3_folder_name, function() {

                        //5. save lander into DB, save endpoints into DB (create stored proc for this?)
                        saveLanderToDb(function(err) {
                          if (err) {
                            callback(err);
                          } else {

                            //6. pagespeed test endpoints (deployed endpoints, original and optimized)

                            //7. add endpoints to db for this lander

                            //8. return correct landerData for endpoints
                            //returnData is the actual data to return
                            var returnData = {
                            	id: landerData.id,
                            	created_on: landerData.created_on,
                            	s3_folder_name: s3_folder_name
                            }
                            callback(false, returnData);
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
  }
}
