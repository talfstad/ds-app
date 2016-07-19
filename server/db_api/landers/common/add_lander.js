module.exports = function(app, db) {

  var htmlFileOptimizer = require("../../../optimizer")(app);
  var dbAws = require('../../aws')(app, db);
  var dbCommon = require('../../common')(db);

  var psi = require('psi');

  return {

    addOptimizePushSave: function(user, localStagingPath, s3_folder_name, landerData, callback) {

      //4. createDirectory in s3 for optimized
      //5. push optimized
      //6. pagespeed test endpoints (deployed endpoints, original and optimized)
      //7. save lander into DB, save endpoints into DB (create stored proc for this?)
      var remoteStagingPath = "/landers/" + s3_folder_name + "/"

      //1. createDirectory in s3 for original
      //2. push original to s3
      var pushLanderToS3 = function(directory, awsData, gzipped, callback) {
        var username = user.user;
        var fullDirectory = username + directory;
        var baseBucketName = awsData.aws_root_bucket;

        var credentials = {
          accessKeyId: awsData.aws_access_key_id,
          secretAccessKey: awsData.aws_secret_access_key
        }
        if (gzipped) {
          dbAws.s3.copyGzippedDirFromStagingToS3(localStagingPath, credentials, username, baseBucketName, fullDirectory, function(err) {
            if (err) {
              callback(err);
            } else {
              callback(false);
            }
          });
        } else {
          dbAws.s3.copyDirFromStagingToS3(localStagingPath, credentials, username, baseBucketName, fullDirectory, function(err) {
            if (err) {
              callback(err);
            } else {
              callback(false);
            }
          });
        }

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

      var getPagespeedScore = function(url, callback) {
        //6. pagespeed test endpoints (deployed endpoints, original and optimized)
        psi(url, { strategy: 'mobile' }).then(data => {
          callback(false, data.ruleGroups.SPEED.score);
        });
      };

      var addEndpointsToLander = function(originalPagespeed, optimizedPagespeed, filePath, callback) {
        var endpoint = {
          filename: filePath,
          original_pagespeed: originalPagespeed,
          optimized_pagespeed: optimizedPagespeed
        };
        var user_id = user.id;

        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("CALL add_url_endpoint(?, ?, ?, ?, ?);", [user_id, landerData.id, originalPagespeed, optimizedPagespeed, filePath], function(err, docs) {
              if (err) {
                callback(err);
              } else {
                //TODO: validate credentials by creating archive bucket with name user.uid
                endpoint.id = docs[0][0]["LAST_INSERT_ID()"];
                callback(false, endpoint);
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

          var addUrlEndpoint = function(filePath, callback) {
            var originalUrl = 'http://' + awsData.aws_root_bucket + '.s3-website-us-west-2.amazonaws.com/' + user.user + '/landers/' + s3_folder_name + '/original/' + filePath;
            var optimizedUrl = 'http://' + awsData.aws_root_bucket + '.s3-website-us-west-2.amazonaws.com/' + user.user + '/landers/' + s3_folder_name + '/optimized/' + filePath;
            getPagespeedScore(originalUrl, function(err, originalPagespeed) {
              if (err) {
                callback(err);
              } else {
                getPagespeedScore(optimizedUrl, function(err, optimizedPagespeed) {
                  if (err) {
                    callback(err)
                  } else {
                    addEndpointsToLander(originalPagespeed, optimizedPagespeed, filePath, function(err, endpoint) {
                      if (err) {
                        callback(err);
                      } else {
                        callback(false, endpoint);
                      }
                    });
                  }
                });
              }
            });
          };


          var directory = "/landers/" + s3_folder_name + "/original/";
          pushLanderToS3(directory, awsData, false, function(err) {
            if (err) {
              callback(err);
            } else {
              //3. optimize the staging directory
              htmlFileOptimizer.fullyOptimize(localStagingPath, function(err, endpointPaths) {
                if (err) {
                  callback(err);
                } else {
                  //4. push optimized to s3
                  var directory = "/landers/" + s3_folder_name + "/optimized/";
                  pushLanderToS3(directory, awsData, true, function(err) {
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

                            var asyncIndex = 0;
                            for (var i = 0; i < endpointPaths.length; i++) {
                              //strip off the staging part of the path so its web root
                              var filePath = endpointPaths[i].replace(localStagingPath +"/", "");

                              var urlEndpoints = [];
                              addUrlEndpoint(filePath, function(err, endpoint) {
                                if (err) {
                                  callback(err);
                                } else {
                                  urlEndpoints.push(endpoint);
                                  if (++asyncIndex == endpointPaths.length) {
                                    //done adding endpoints
                                    var returnData = {
                                      id: landerData.id,
                                      created_on: landerData.created_on,
                                      s3_folder_name: s3_folder_name,
                                      url_endpoints_arr: urlEndpoints
                                    };

                                    callback(false, returnData);
                                  }
                                }
                              });
                            }
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
