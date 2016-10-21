module.exports = function(app, dbApi, awsApi) {

  var htmlFileOptimizer = require("../optimize")(app, dbApi, awsApi);

  var find = require('find');
  var fs = require('fs');
  var path = require('path');
  var psi = require('psi');
  var cheerio = require('cheerio');

  return _.extend({

    optimizePushSave: function(deleteStagingOrJobIdOrOptions, user, localStagingPath, s3_folder_name, landerData, callback) {
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
        if (options.jobId) {
          jobId = options.jobId;
        } else {
          jobId = false;
        }
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

        var finishExternalInterruptNormally = function() {
          deleteStagingAreaIfFlag(localStagingPath, function() {
            callback(err);
          });
        };

        finishExternalInterruptNormally();
      };


      var deleteStagingAreaIfFlag = function(staging_path, callback) {
        if (deleteStaging) {
          dbApi.common.deleteStagingArea(staging_path, function() {
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

        dbApi.jobs.checkIfExternalInterrupt(user, jobId, function(err, interruptCode) {
          if (err || interruptCode) {
            if (interruptCode) {
              cleanupStagingAndCallbackExternalInterrupt({ code: interruptCode });
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
            awsApi.s3.copyDirFromStagingToS3(landerData.id, gzipped, localStagingPath, credentials, username, baseBucketName, fullDirectory, function(err) {
              if (err) {
                callback(err);
              } else {
                callback(false);
              }
            });
          }
        });
      };

      var checkIfUpdateOrNew = function(callback) {
        var lander_id = landerData.id;

        //weird thing where landerData.id is a string on add lander but not on rip lander
        if (lander_id == "null") {
          lander_id = null;
        }

        dbApi.landers.getUrlEndpointsForLander(user, lander_id, function(err, docs) {
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
        });
      };

      var getPagespeedScore = function(url, callback) {
        //6. pagespeed test endpoints (deployed endpoints, original and optimized)
        psi(url, { strategy: 'mobile' }).then(data => {
          callback(false, data.ruleGroups.SPEED.score);
        }).catch(err => {
          callback(err);
        });
      };

      var addUpdateEndpoint = function(originalPagespeed, optimizedPagespeed, endpoint, isUpdate, callback) {

        var filePath = endpoint.filename;
        var optimizationErrorsString = JSON.stringify(endpoint.optimizationErrors);
        var lander_id = landerData.id;

        var endpoint = {
          lander_id: landerData.id,
          filePath: filePath,
          original_pagespeed: originalPagespeed,
          optimized_pagespeed: optimizedPagespeed,
          optimization_errors: endpoint.optimizationErrors,
          isUpdate: isUpdate
        };

        dbApi.landers.addUpdateEndpoint(user, endpoint, function(err, endpoint) {
          if (err) {
            callback(err);
          } else {
            callback(false, endpoint);
          }
        });

      };

      //logic begins here
      dbApi.aws.keys.getAmazonApiKeysAndRootBucket(user, function(err, awsData) {
        if (err) {
          callback(err);
        } else {

          //add or update url endpoint data
          var runPageSpeedScores = function(endpoint, callback) {
            endpoint.filename = endpoint.filename.replace(localStagingPath + "/", "");
            var filePath = endpoint.filename;

            var originalUrl = 'http://' + awsData.aws_root_bucket + '.s3-website-us-west-2.amazonaws.com/' + user.user + '/landers/' + s3_folder_name + '/original/' + filePath;
            var optimizedUrl = 'http://' + awsData.aws_root_bucket + '.s3-website-us-west-2.amazonaws.com/' + user.user + '/landers/' + s3_folder_name + '/optimized/' + filePath;
            var pagespeedError = false;
            app.log("getting pagespeed for: " + originalUrl, "debug");
            getPagespeedScore(originalUrl, function(err, originalPagespeed) {
              if (err) {
                originalPagespeed = 0;
                pagespeedError = true;
              }

              app.log("getting optimized pagespeed for: " + optimizedUrl, "debug");

              getPagespeedScore(optimizedUrl, function(err, optimizedPagespeed) {
                if (err) {
                  optimizedPagespeed = 0;
                  pagespeedError = true;
                }
                if (pagespeedError) {
                  endpoint.optimizationErrors.push({
                    type: 'pagespeed',
                    code: 'couldNotGetPagespeed'
                  });
                }
                callback(false, endpoint, originalPagespeed, optimizedPagespeed);
              });

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
              checkIfUpdateOrNew(function(err, isUpdate) {
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
                            if (err.error_code == "TimeoutInterrupt" || err.code == "ExternalInterrupt" || err.code == "UserReportedInterrupt") {
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

                                            addUpdateEndpoint(originalPagespeed, optimizedPagespeed, endpoint, isUpdate, function(err, endpoint) {
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

  }, {});
};
