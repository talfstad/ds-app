module.exports = function(app, db) {

  var dbAws = require('./aws')(app, db);
  var dbLanders = require('./landers')(app, db);
  var cheerio = require('cheerio');

  var module = {

    saveNewSnippet: function(user, attr, successCallback) {
      var user_id = user.id;

      var code = "";
      var name = attr.name;
      var description = attr.description;
      var load_before_dom = attr.load_before_dom;

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        }
        connection.query("call add_new_snippet(?, ?, ?, ?)", [user_id, name, description, load_before_dom], function(err, docs) {
          if (err) {
            console.log(err);
          } else {
            successCallback({
              id: docs[0][0]["LAST_INSERT_ID()"],
              snippet_id: docs[0][0]["LAST_INSERT_ID()"]
            });
          }
          connection.release();
        });
      });

    },

    getAll: function(user, successCallback) {

      var user_id = user.id;

      var getAllJsSnippetsDb = function(gotSnippetsCallback) {
        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          }
          connection.query("SELECT id, code, name, load_before_dom, for_everyone, description FROM snippets WHERE user_id = ? OR for_everyone = ?", [user_id, true], function(err, dbsnippets) {
            if (err) {
              console.log(err);
            } else {
              for (var i = 0; i < dbsnippets.length; i++) {
                var snippet = dbsnippets[i];
                snippet.snippet_id = snippet.id
              }
              gotSnippetsCallback(dbsnippets);
            }
            connection.release();
          });
        });
      };


      //call to get all and return rows
      getAllJsSnippetsDb(function(domains) {
        return successCallback(domains);
      });

    },



    saveEditInfo: function(user, params, callback) {
      var description = params.description;
      var name = params.name;
      var snippet_id = params.snippet_id;
      var user_id = user.id;
      var load_before_dom = params.load_before_dom;

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("UPDATE snippets SET name = ?, load_before_dom = ?, description = ? WHERE id = ? AND user_id = ?", [name, load_before_dom, description, snippet_id, user_id],
            function(err, docs) {
              if (err) {
                console.log(err);
                callback(err);
              } else {
                callback(false);
              }
              //release connection
              connection.release();
            });
        }
      });

    },

    saveCode: function(user, params, successCallback) {
      var user_id = user.id;
      var code = params.code;
      var snippet_id = params.snippet_id;

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("UPDATE snippets SET code = ? WHERE id = ? AND user_id = ?", [code, snippet_id, user_id],
            function(err, docs) {
              if (err) {
                console.log(err);
                errorCallback("\nError updating snippet code.");
              } else {
                successCallback(docs);
              }
              //release connection
              connection.release();
            });
        }
      });


    },


    removeActiveSnippet: function(user, active_snippet_id, callback) {
      var user_id = user.id;

      //join urlendpoints with active snippets
      var getParams = function(callback) {

        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          } else {
            connection.query("SELECT a.url_endpoint_id as urlEndpointId, a.snippet_id, b.lander_id FROM active_snippets a, url_endpoints b WHERE a.id = ? AND a.user_id = ? AND a.url_endpoint_id = b.id", [active_snippet_id, user_id],
              function(err, docs) {
                if (err) {
                  callback(err);
                } else {
                  console.log("GOT DOCS: " + JSON.stringify(docs));
                  var params = docs[0];
                  params.action = "delete";
                  callback(false, params);
                }
                //release connection
                connection.release();
              });
          }
        });

      };

      getParams(function(err, params) {
        module.addSnippetToUrlEndpoint(user, params, function(err) {
          console.log("params; " + JSON.stringify(params));

          db.getConnection(function(err, connection) {
            if (err) {
              console.log(err);
            } else {
              connection.query("DELETE FROM active_snippets WHERE id = ? AND user_id = ?", [active_snippet_id, user_id],
                function(err, docs) {
                  if (err) {
                    console.log(err);
                    callback(err);
                  } else {
                    console.log("DELETED! ! success id: " + active_snippet_id);
                    callback(false, {});
                  }
                  //release connection
                  connection.release();
                });
            }
          });

        });
      });

    },



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
            console.log(err);
          }
          connection.query("SELECT filename FROM url_endpoints WHERE user_id = ? AND id = ?", [user_id, urlEndpointId], function(err, docs) {
            if (err) {
              callback(err);
            } else {
              callback(false, docs[0]);
            }
            connection.release();
          });
        });
      };

      var getSnippetCode = function(snippetId, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          }
          connection.query("SELECT code, load_before_dom FROM snippets WHERE user_id = ? AND id = ?", [user_id, snippetId], function(err, docs) {
            if (err) {
              callback(err);
            } else {
              callback(false, docs[0]);
            }
            connection.release();
          });
        });
      }

      var addSnippetToEndpoint = function(snippet_id, urlEndpointId, user_id, callback) {
        console.log("SNIPPET ID : " + snippet_id);
        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
            callback(err);
          } else {
            connection.query("call add_snippet_to_url_endpoint(?, ?, ?)", [snippet_id, urlEndpointId, user_id], function(err, docs) {
              if (err) {
                console.log(err);
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
      dbLanders.getAll(user, function(err, landers) {
        if (err) {
          callback(err);
        } else {
          var lander = landers[0];
          var s3_folder_name = lander.s3_folder_name;

          dbAws.keys.getAmazonApiKeysAndRootBucket(user, function(err, awsData) {
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

                  dbAws.s3.getObject(credentials, rootBucket, key, function(err, data) {
                    if (err) {
                      callback(err);
                    } else {
                      var fileData = data.Body.toString();

                      //write the snippet into the file using cheerio
                      var $ = cheerio.load(fileData);
                      console.log("snippet id : TTT3333 " +  snippet_id);
                      
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
                            console.log("TTTT GOT HEREEE TO DO ITT");
                            var code = data.code;
                            var load_before_dom = data.load_before_dom;

                            var scriptTag;
                            if (load_before_dom) {
                              scriptTag = $("<script id='snippet-" + snippet_id + "' class='ds-no-modify'></script>");
                              scriptTag.append(code);

                              $('head').append(scriptTag);
                            console.log("TTTT GOT HEREEE TO DO HEAD ITT");

                            } else {
                            console.log("TTTT GOT HEREEE TO BODY DO ITT");

                              scriptTag = $("<script id='snippet-" + snippet_id + "'></script>");
                              scriptTag.append(code);

                              $('body').append(scriptTag);
                            }
                          }

                          //write the file $.html() to s3
                          dbAws.s3.putObject(credentials, rootBucket, key, $.html(), function(err, data) {
                            if (err) {
                              callback(err);
                            } else {
                              var landerId = lander_id.lander_id;

                              //update lander to modified and return that
                              dbLanders.updateLanderModifiedData(user, { id: landerId, modified: true }, function(err, id) {
                                if (err) {
                                  console.log(err);
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

    }

  };
  return module;
}
