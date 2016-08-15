module.exports = function(app, db) {

  var htmlFileOptimizer = require("../../../optimizer")(app);
  var dbAws = require('../../aws')(app, db);
  var dbCommon = require('../../common')(db);
  var find = require('find');
  var fs = require('fs');
  var path = require('path');
  var psi = require('psi');

  return {

    addOptimizePushSave: function(deleteStaging, user, localStagingPath, s3_folder_name, landerData, callback) {

      //make sure all images are decoded from the uri 
      var decodeImagesAndOverwrite = function(callback) {

        var writeDecodedImage = function(imageDir, imageName, decodedImageName, callback) {
          if (imageName != decodedImageName) {

            var oldPath = path.join(imageDir, imageName);
            var newPath = path.join(imageDir, decodedImageName);

            fs.rename(oldPath, newPath, function(err) {
              if (err) {
                callback(err);
              } else {
                callback(false);
              }
            });
          } else {
            callback(false);
          }
        };

        find.file(/\.jpg$|\.jpeg$|\.gif$|\.png$/, localStagingPath, function(allImages) {

          var asyncIndex = 0;
          for (var i = 0; i < allImages.length; i++) {

            var imageFilePath = allImages[i];

            var imageName = path.basename(imageFilePath);
            var imageDir = path.dirname(imageFilePath);
            var decodedImageName = decodeURI(imageName);

            writeDecodedImage(imageDir, imageName, decodedImageName, function(err) {
              if (err) {
                callback(err);
              } else {
                if (++asyncIndex == allImages.length) {
                  callback(false);
                }
              }
            });
          }
          if (allImages.length <= 0) {
            callback(false);
          }
        });
      };

      //4. createDirectory in s3 for optimized
      //5. push optimized
      //6. pagespeed test endpoints (deployed endpoints, original and optimized)
      //7. save lander into DB, save endpoints into DB (create stored proc for this?)
      var remoteStagingPath = "/landers/" + s3_folder_name + "/";

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

        //weird thing where landerData.id is a string on add lander but not on rip lander
        if (landerData.id == "null") {
          landerData.id = null;
        }

        if (landerData.id) {
          //update lander, but optimization only updates urlEndpoints
          callback(false, true);
        } else {
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

                    callback(false, false);
                  }
                  connection.release();
                });
            }
          });
        }

      };

      var getPagespeedScore = function(url, callback) {
        //6. pagespeed test endpoints (deployed endpoints, original and optimized)
        psi(url, { strategy: 'mobile' }).then(data => {
          callback(false, data.ruleGroups.SPEED.score);
        }).catch(err => {
          callback(err);
        });
      };

      var addUpdateEndpointsToLander = function(originalPagespeed, optimizedPagespeed, endpoint, isUpdate, callback) {

        var filePath = endpoint.filename;
        var optimizationErrorsString = JSON.stringify(endpoint.optimizationErrors);

        var endpoint = {
          filename: filePath,
          original_pagespeed: originalPagespeed,
          optimized_pagespeed: optimizedPagespeed,
          optimization_errors: endpoint.optimizationErrors
        };
        var user_id = user.id;

        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            var query = "CALL add_url_endpoint(?, ?, ?, ?, ?, ?);";

            var queryArr = [user_id, landerData.id, originalPagespeed, optimizedPagespeed, filePath, optimizationErrorsString];

            if (isUpdate) {
              query = "UPDATE url_endpoints SET original_pagespeed = ?, optimized_pagespeed = ?, optimization_errors = ? WHERE lander_id = ?";
              queryArr = [originalPagespeed, optimizedPagespeed, optimizationErrorsString, landerData.id];
            }

            connection.query(query, queryArr, function(err, docs) {
              if (err) {
                callback(err);
              } else {
                //TODO: validate credentials by creating archive bucket with name user.uid
                if (!isUpdate) {
                  endpoint.id = docs[0][0]["LAST_INSERT_ID()"];
                }

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

          //add or update url endpoint data
          var runPageSpeedScores = function(endpoint, callback) {
            endpoint.filename = endpoint.filename.replace(localStagingPath + "/", "");
            var filePath = endpoint.filename;

            var originalUrl = 'http://' + awsData.aws_root_bucket + '.s3-website-us-west-2.amazonaws.com/' + user.user + '/landers/' + s3_folder_name + '/original/' + filePath;
            var optimizedUrl = 'http://' + awsData.aws_root_bucket + '.s3-website-us-west-2.amazonaws.com/' + user.user + '/landers/' + s3_folder_name + '/optimized/' + filePath;


            console.log("gettign pagespeed for: " + originalUrl);
            getPagespeedScore(originalUrl, function(err, originalPagespeed) {
              if (err) {
                callback(err);
              } else {
                console.log("gettign optimized pagespeed for: " + optimizedUrl);

                getPagespeedScore(optimizedUrl, function(err, optimizedPagespeed) {
                  if (err) {
                    callback(err)
                  } else {
                    callback(false, endpoint, originalPagespeed, optimizedPagespeed);
                  }
                });
              }
            });
          };

          var deleteStagingAreaIfFlag = function(staging_path, callback) {
            if (deleteStaging) {
              dbCommon.deleteStagingArea(staging_path, function() {
                callback(false);
              });
            } else {
              callback(false);
            }
          };

          //before push lander make sure images are decoded
          decodeImagesAndOverwrite(function(err) {
            if (err) {
              callback(err);
            } else {
              var directory = "/landers/" + s3_folder_name + "/original/";
              pushLanderToS3(directory, awsData, false, function(err) {
                if (err) {
                  callback(err);
                } else {
                  //3. optimize the staging directory
                  htmlFileOptimizer.fullyOptimize(localStagingPath, function(err, endpoints) {
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
                          deleteStagingAreaIfFlag(localStagingPath, function(err) {
                            if (err) {
                              callback(err);
                            } else {

                              //5. save/update lander into DB, save endpoints into DB (create stored proc for this?)
                              saveLanderToDb(function(err, isUpdate) {
                                if (err) {
                                  callback(err);
                                } else {
                                  app.log("11is update: " + isUpdate, "debug");

                                  //save
                                  var asyncIndex = 0;
                                  if (endpoints > 0) {
                                    for (var i = 0; i < endpoints.length; i++) {
                                      //strip off the staging part of the path so its web root

                                      var urlEndpoints = [];
                                      //save/update the urlEndpoints in db
                                      runPageSpeedScores(endpoints[i], function(err, endpoint, originalPagespeed, optimizedPagespeed) {
                                        if (err) {
                                          console.log("PAGESPEED ERROR: " + JSON.stringify(err));
                                          callback(err);
                                        } else {

                                          console.log("is update: " + isUpdate + " ENDPOINT ADDING: " + JSON.stringify(endpoint));

                                          addUpdateEndpointsToLander(originalPagespeed, optimizedPagespeed, endpoint, isUpdate, function(err, endpoint) {
                                            if (err) {
                                              console.log("endpoitns to lander  ERROR: " + JSON.stringify(err));
                                              callback(err);
                                            } else {
                                              urlEndpoints.push(endpoint);
                                              console.log("asyncTT: " + asyncIndex + " endpoints.length: " + endpoints.length);

                                              if (++asyncIndex == endpoints.length) {
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
                                      });
                                    }
                                  } else {
                                    callback(false);
                                  }
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
            }
          });
        }
      });
    }
  }
}
