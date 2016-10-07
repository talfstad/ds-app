module.exports = function(app, db) {
  var htmlFileOptimizer = require("../../../optimizer")(app, db);
  var dbAws = require('../../aws')(app, db);
  var dbCommon = require('../../common')(app, db);
  var find = require('find');
  var fs = require('fs');
  var path = require('path');
  var psi = require('psi');
  var cheerio = require('cheerio');
  var dbJobs = require('../../jobs')(app, db);


  /*

  add lander takes a staging area and will completely optimize a lander and push it to s3 (for preview)

  this is used for save (1 rest call) and deploy (async job)


  for async job you pass a job ID and we dont delete the staging area in here, for syncrounous we always
  delete the staging area in here.


  if this is a job, we check to make sure the job isnt canceled at key places:

    . push to s3

    . within fully optimize at:
      -before start
      -optimize images
      -gzip

  if job canceled we clean up and callback that it was canceled

  */



  return {

    addOptimizePushSave: function(deleteStagingOrJobIdOrOptions, user, localStagingPath, s3_folder_name, landerData, callback) {
      var jobId, endpointName, deleteStaging, options = {};
      //if not bool its a job id
      if (typeof deleteStagingOrJobIdOrOptions == "object") {
        options = deleteStagingOrJobIdOrOptions;

        //TODO: use these options to:
        //    . not optimize anything except endpointName if it has a value
        //    . if endpointName has value only add this as endpoint to show
        //    . edit feature will still show all the files, but the entry point is what we preview
        //    . on add lander, only optimize the endpointName (TODO)
        deleteStaging = options.deleteStaging;
        jobId = false;
      } else {
        if (deleteStagingOrJobIdOrOptions != true && deleteStagingOrJobIdOrOptions != false) {
          jobId = deleteStagingOrJobIdOrOptions;
        } else {
          jobId = false;
        }
      }

      if (!deleteStaging) {
        if (deleteStagingOrJobIdOrOptions == true) {
          deleteStaging = true;
        } else {
          deleteStaging = false;
        }
      }


      var cleanupStagingAndCallbackExternalInterrupt = function(err) {
        deleteStagingAreaIfFlag(localStagingPath, function() {
          callback(err);
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

        dbJobs.checkIfExternalInterrupt(user, jobId, function(err, isInterrupt) {
          if (err || isInterrupt) {
            if (isInterrupt) {
              cleanupStagingAndCallbackExternalInterrupt({ code: "ExternalInterrupt" });
            } else {
              callback(err);
            }
          } else {

            var username = user.user;
            var fullDirectory = username + directory;
            var baseBucketName = awsData.aws_root_bucket;

            var credentials = {
              accessKeyId: awsData.aws_access_key_id,
              secretAccessKey: awsData.aws_secret_access_key
            }

            //only push to s3 for this if this job is not canceled, if canceled callback error ExternalInterrupt
            dbAws.s3.copyDirFromStagingToS3(landerData.id, gzipped, localStagingPath, credentials, username, baseBucketName, fullDirectory, function(err) {
              if (err) {
                callback(err);
              } else {
                callback(false);
              }
            });
          }
        });
      };

      var saveLanderToDb = function(callback) {
        var user_id = user.id;

        //weird thing where landerData.id is a string on add lander but not on rip lander
        if (landerData.id == "null") {
          landerData.id = null;
        }

        if (landerData.id) {
          //update lander, but optimization only updates urlEndpoints
          //if we have endpoints its an update, otherwise its not
          db.getConnection(function(err, connection) {
            if (err) {
              callback(err);
            } else {
              connection.query("SELECT id FROM url_endpoints WHERE lander_id = ? AND user_id = ?", [landerData.id, user_id], function(err, docs) {
                if (err) {
                  callback(err);
                } else {
                  //if we have endpoints then its an update! otherwise its not an update
                  if (docs.length > 0) {
                    app.log("have endpoints so this IS and update!", "debug");
                    callback(false, true);
                  } else {
                    app.log("have NO endpoints so this IS NOT and update!", "debug");
                    callback(false, false);
                  }
                }
                connection.release();
              });
            }
          });
        } else {
          var modelAttributes = {};

          //param order: working_node_id, action, alternate_action, processing, lander_id, domain_id, group_id, user_id
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


            app.log("getting pagespeed for: " + originalUrl, "debug");
            getPagespeedScore(originalUrl, function(err, originalPagespeed) {
              if (err) {
                callback(err);
              } else {
                app.log("getting optimized pagespeed for: " + optimizedUrl, "debug");

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

          var makeRootLinksRelative = function(callback) {
            var isExternal = function(href) {
              return /(^\/\/)|(:\/\/)/.test(href);
            };

            find.file(/\.html$/, localStagingPath, function(allHtmlFiles) {
              if (allHtmlFiles.length > 0) {
                var changeAnchorLinks = function(fromPath, $) {
                  $('a').each(function(idx, el) {
                    var href = $(this).attr('href');

                    if (href && !isExternal(href)) {
                      var resourcePath = path.join(fromPath, href);
                      if (/^\//.test(href)) {
                        //use lcoalstatgin path as root
                        resourcePath = path.join(localStagingPath, href);
                      }
                      var relativePath = path.relative(fromPath, resourcePath);
                      $(this).attr('href', relativePath);
                    }
                  });
                };

                var changeCssLinks = function(fromPath, $) {
                  $('link[rel=stylesheet]').each(function(idx, el) {
                    var href = $(this).attr('href');

                    if (href && !isExternal(href)) {
                      var resourcePath = path.join(fromPath, href);
                      if (/^\//.test(href)) {
                        //use lcoalstatgin path as root
                        resourcePath = path.join(localStagingPath, href);
                      }
                      var relativePath = path.relative(fromPath, resourcePath);
                      $(this).attr('href', relativePath);
                    }

                  });
                };

                var changeJsLinks = function(fromPath, $) {
                  $('script').each(function(idx, el) {
                    var src = $(this).attr('src');

                    if (src && !isExternal(src)) {
                      var resourcePath = path.join(fromPath, src);
                      if (/^\//.test(src)) {
                        //use lcoalstatgin path as root
                        resourcePath = path.join(localStagingPath, src);
                      }
                      var relativePath = path.relative(fromPath, resourcePath);
                      $(this).attr('src', relativePath);
                    }

                  });
                };

                var changeImageLinks = function(fromPath, $) {
                  $('img').each(function(idx, el) {
                    var src = $(this).attr('src');

                    if (src && !isExternal(src)) {
                      var resourcePath = path.join(fromPath, src);
                      if (/^\//.test(src)) {
                        //use lcoalstatgin path as root
                        resourcePath = path.join(localStagingPath, src);
                      }
                      var relativePath = path.relative(fromPath, resourcePath);
                      $(this).attr('src', relativePath);
                    }

                  });
                };

                _.each(allHtmlFiles, function(htmlFile) {
                  var relativeFrom = path.dirname(htmlFile);
                  var $ = cheerio.load(fs.readFileSync(htmlFile), { decodeEntities: false });

                  //image source, src for js, video src, (check rip default), fonts...
                  changeAnchorLinks(relativeFrom, $);
                  changeImageLinks(relativeFrom, $);
                  changeCssLinks(relativeFrom, $);
                  changeJsLinks(relativeFrom, $);

                  fs.writeFileSync(htmlFile, $.html());
                });
                callback(false);
              } else {
                callback(false);
              }
            });

          };

          //before push lander make sure images are decoded
          decodeImagesAndOverwrite(function(err) {
            if (err) {
              callback(err);
            } else {
              //5. save/update lander into DB, save endpoints into DB (create stored proc for this?)
              saveLanderToDb(function(err, isUpdate) {
                if (err) {
                  callback(err);
                } else {

                  var directory = "/landers/" + s3_folder_name + "/original/";

                  makeRootLinksRelative(function() {

                    //get a lock to push the original 
                    pushLanderToS3(directory, awsData, false, function(err) {
                      if (err) {
                        callback(err);
                      } else {

                        var directory = "/landers/" + s3_folder_name + "/optimized/";
                        var relativeToThis = "/" + user.user + "/landers/" + s3_folder_name + "/optimized";

                        //3. optimize the staging directory
                        user.options = options; //pass options into full optimize
                        htmlFileOptimizer.fullyOptimize(user, jobId, localStagingPath, function(err, endpoints) {
                          if (err) {
                            if (err.code == "ExternalInterrupt") {
                              cleanupStagingAndCallbackExternalInterrupt(err);
                            } else {
                              callback(err);
                            }
                          } else {
                            //4. push optimized to s3
                            pushLanderToS3(directory, awsData, true, function(err) {
                              if (err) {
                                callback(err);
                              } else {

                                //4. remove local staging
                                deleteStagingAreaIfFlag(localStagingPath, function(err) {
                                  if (err) {
                                    callback(err);
                                    return;
                                  } else {

                                    //save
                                    var asyncIndex = 0;
                                    if (endpoints.length > 0) {
                                      for (var i = 0; i < endpoints.length; i++) {
                                        //strip off the staging part of the path so its web root

                                        var urlEndpoints = [];
                                        //save/update the urlEndpoints in db
                                        runPageSpeedScores(endpoints[i], function(err, endpoint, originalPagespeed, optimizedPagespeed) {
                                          if (err) {
                                            app.log("PAGESPEED ERROR: " + JSON.stringify(err), "debug");
                                            callback(err);
                                          } else {

                                            app.log("is update: " + isUpdate + " ENDPOINT ADDING: " + JSON.stringify(endpoint), "debug");

                                            addUpdateEndpointsToLander(originalPagespeed, optimizedPagespeed, endpoint, isUpdate, function(err, endpoint) {
                                              if (err) {
                                                app.log("endpoints to lander  ERROR: " + JSON.stringify(err), "debug");
                                                callback(err);
                                              } else {
                                                urlEndpoints.push(endpoint);

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
                                      var returnData = {
                                        id: landerData.id,
                                        created_on: landerData.created_on,
                                        s3_folder_name: s3_folder_name,
                                        url_endpoints_arr: []
                                      };
                                      callback(false, returnData);
                                    }
                                  }
                                });
                              }
                            });
                          }
                        });
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
  }
}
