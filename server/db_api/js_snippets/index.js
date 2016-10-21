module.exports = function(app, db, base) { // awsApi stuff needs to go to controller

  var path = require("path");
  var fs = require("fs");
  var cheerio = require('cheerio');

  var module = _.extend({

    //add this snippet to active snippets
    addSnippetToUrlEndpoint: function(user, params, callback) {
      var snippet_id = params.snippet_id;
      var urlEndpointId = params.urlEndpointId;
      var action = params.action || false;
      var user_id = user.id;
      var lander_id = {
        lander_id: params.lander_id
      };

      var getUrlEndpointData = function(urlEndpointId, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT filename FROM url_endpoints WHERE user_id = ? AND id = ?", [user_id, urlEndpointId], function(err, docs) {
              if (err) {
                callback(err);
              } else {
                callback(false, docs[0]);
              }
              connection.release();
            });
          }

        });
      };

      var getSnippetCode = function(snippetId, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT code, load_before_dom FROM snippets WHERE user_id = ? AND id = ?", [user_id, snippetId], function(err, docs) {
              if (err) {
                callback(err);
              } else {
                callback(false, docs[0]);
              }
              connection.release();
            });
          }

        });
      }

      var addSnippetToEndpoint = function(snippet_id, urlEndpointId, user_id, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("call add_snippet_to_url_endpoint(?, ?, ?)", [snippet_id, urlEndpointId, user_id], function(err, docs) {
              if (err) {
                callback(err);
              } else {
                callback(false, {
                  id: docs[0][0]["LAST_INSERT_ID()"]
                });
              }
              connection.release();
            });
          }
        });
      }

      //1. assemble the s3 key for the endpoint and the bucket
      // 'http://' + awsData.aws_root_bucket + '.s3-website-us-west-2.amazonaws.com/' + user.user + '/landers/' + s3_folder_name + '/optimized/' + filePath;
      base.landers.getAll(user, function(err, landers) {
        if (err) {
          callback(err);
        } else {
          var lander = landers[0];
          var s3_folder_name = lander.s3_folder_name;

          base.aws.keys.getAmazonApiKeysAndRootBucket(user, function(err, awsData) {
            if (err) {
              callback(err);
            } else {
              var credentials = {
                accessKeyId: awsData.aws_access_key_id,
                secretAccessKey: awsData.aws_secret_access_key
              }

              getUrlEndpointData(urlEndpointId, function(err, urlEndpointData) {
                if (err) {
                  callback(err);
                } else {
                  var filename = urlEndpointData.filename;

                  var rootBucket = awsData.aws_root_bucket;
                  var key = user.user + "/landers/" + s3_folder_name + "/original/" + filename;

                  awsApi.s3.getObject(lander.id, credentials, rootBucket, key, function(err, data) {
                    if (err) {
                      callback(err);
                    } else {
                      var fileData = data.Body.toString();

                      //write the snippet into the file using cheerio
                      var $ = cheerio.load(fileData, { decodeEntities: false });

                      snippetAlreadyOnPage = $('#snippet-' + snippet_id);

                      if (snippetAlreadyOnPage.length > 0) {
                        snippetAlreadyOnPage.remove();
                      }

                      //get what we want to write in order
                      getSnippetCode(snippet_id, function(err, data) {
                        if (err) {
                          callback(err);
                        } else {

                          if (action != "delete") {
                            var code = data.code;
                            var load_before_dom = data.load_before_dom;


                            var scriptTag;
                            if (load_before_dom) {
                              scriptTag = $("<script id='snippet-" + snippet_id + "' class='ds-no-modify'>" + code + "</script>");
                              $('head').append(scriptTag);
                            } else {
                              scriptTag = $("<script id='snippet-" + snippet_id + "' class='ds-no-modify'>" + code + "</script>");
                              $('body').append(scriptTag);
                            }
                          }

                          //write the file $.html() to s3
                          awsApi.s3.putObject(lander_id.lander_id, credentials, rootBucket, key, $.html(), function(err, data) {
                            if (err) {
                              callback(err);
                            } else {
                              var landerId = lander_id.lander_id;

                              //update lander to modified and return that
                              base.landers.updateLanderModifiedData(user, { id: landerId, modified: true }, function(err, id) {
                                if (err) {
                                  callback(err);
                                } else {
                                  if (action == "delete") {
                                    //if delete dont save lander data or add endpoint
                                    callback(false);
                                  } else {
                                    addSnippetToEndpoint(snippet_id, urlEndpointId, user_id, function(err, returnObj) {
                                      if (err) {
                                        callback(err);
                                      } else {
                                        callback(false, returnObj);
                                      }
                                    });
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
      }, [lander_id]);

    },

    removeSnippetFromAllEndpointsRunCustomAndPush: function(user, snippet_id, run_custom_sync, callback) {
      var user_id = user.id;
      //  . get endpoints with snippets joined with landers to get lander_id so we can get s3_folder_name later
      var getEndpointsWithSnippets = function(callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT a.filename, a.id as url_endpoint_id, b.id as active_snippet_id, a.lander_id FROM url_endpoints a, active_snippets b WHERE a.id = b.url_endpoint_id AND a.user_id = ? AND b.snippet_id = ?", [user_id, snippet_id],
              function(err, docs) {
                if (err) {
                  callback(err);
                } else {
                  callback(false, docs);
                }
                //release connection
                connection.release();
              });
          }
        });
      };

      var getEndpointFromS3 = function(endpoint, callback) {
        var filename = endpoint.filename;
        var lander_id = { lander_id: endpoint.lander_id };

        //  . put together the correct key and get aws stuff to get endpoint
        base.landers.getAll(user, function(err, landers) {
          if (err) {
            callback(err);
          } else {
            var lander = landers[0];
            var s3_folder_name = lander.s3_folder_name;

            base.aws.keys.getAmazonApiKeysAndRootBucket(user, function(err, awsData) {
              if (err) {
                callback(err);
              } else {
                var credentials = {
                  accessKeyId: awsData.aws_access_key_id,
                  secretAccessKey: awsData.aws_secret_access_key
                }

                var rootBucket = awsData.aws_root_bucket;
                var key = user.user + "/landers/" + s3_folder_name + "/original/" + filename;

                awsApi.s3.getObject(lander_id.lander_id, credentials, rootBucket, key, function(err, data) {
                  if (err) {
                    callback(err);
                  } else {

                    var fileData = data.Body.toString();
                    callback(false, fileData, credentials, key, rootBucket, lander_id);

                  }
                });

              }
            });
          }
        }, [lander_id]);
      };

      getEndpointsWithSnippets(function(err, endpoints) {
        if (err) {
          callback(err);
        } else {
          //  . get the endpoint snippet from s3
          var landerIdsArr = [];
          var asyncIndex = 0;
          for (var i = 0; i < endpoints.length; i++) {
            var endpoint = endpoints[i];

            app.log("endpoint: " + JSON.stringify(endpoint), "debug");

            //create lander_ids array to return to client
            if (landerIdsArr.indexOf(endpoints[i].lander_id) <= -1) {
              //not in array so add it
              landerIdsArr.push(endpoints[i]);
            }

            getEndpointFromS3(endpoint, function(err, fileData, credentials, key, rootBucket, lander_id) {
              if (err) {
                callback(err);
              } else {
                //write the snippet into the file using cheerio
                var $ = cheerio.load(fileData, { decodeEntities: false });

                snippetAlreadyOnPage = $('#snippet-' + snippet_id);

                if (snippetAlreadyOnPage.length > 0) {
                  snippetAlreadyOnPage.remove();
                }

                // run custom synronous code here
                run_custom_sync($);

                //write the file $.html() to s3
                awsApi.s3.putObject(lander_id, credentials, rootBucket, key, $.html(), function(err, data) {
                  if (err) {
                    callback(err);
                  } else {
                    var landerId = lander_id.lander_id;

                    //update lander to modified and return that
                    base.landers.updateLanderModifiedData(user, { id: landerId, modified: true }, function(err, id) {
                      if (err) {
                        callback(err);
                      } else {
                        if (++asyncIndex == endpoints.length) {
                          callback(false, landerIdsArr);
                        }
                      }
                    });
                  }
                });
              }
            });
          }
          if (endpoints.length <= 0) {
            callback(false, landerIdsArr);
          }
        }
      });

      //  . remove the snippet
      //  . run custom
      //  . write endpoint to s3
    },

  }, base.js_snippets);

  return module;
};
