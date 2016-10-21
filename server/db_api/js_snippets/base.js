module.exports = function(app, db) {

  var module = {

    saveNewSnippet: function(user, attr, callback) {
      var user_id = user.id;

      var code = "";
      var name = attr.name;
      var description = attr.description;
      var load_before_dom = attr.load_before_dom;

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("call add_new_snippet(?, ?, ?, ?)", [user_id, name, description, load_before_dom], function(err, docs) {
            if (err) {
              callback(err);
            } else {
              callback(false, {
                id: docs[0][0]["LAST_INSERT_ID()"],
                snippet_id: docs[0][0]["LAST_INSERT_ID()"]
              });
            }
            connection.release();
          });
        }
      });

    },

    getAll: function(user, callback) {

      var user_id = user.id;

      var getAllJsSnippetsDb = function(callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT id, code, name, load_before_dom, for_everyone, description FROM snippets WHERE user_id = ?", [user_id], function(err, dbsnippets) {
              if (err) {
                callback(err);
              } else {
                for (var i = 0; i < dbsnippets.length; i++) {
                  var snippet = dbsnippets[i];
                  snippet.snippet_id = snippet.id
                }
                callback(false, dbsnippets);
              }
              connection.release();
            });
          }
        });
      };

      //call to get all and return rows
      getAllJsSnippetsDb(function(err, domains) {
        return callback(false, domains);
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
          callback(err);
        } else {
          connection.query("UPDATE snippets SET name = ?, load_before_dom = ?, description = ? WHERE id = ? AND user_id = ?", [name, load_before_dom, description, snippet_id, user_id],
            function(err, docs) {
              if (err) {
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
 

    deleteSnippet: function(user, snippet_id, callback) {
      var user_id = user.id;

      var customBeforePush = function($, callback) {
        //  . for delete dont do anything but function is required
        return;
      };

      module.removeSnippetFromAllEndpointsRunCustomAndPush(user, snippet_id, customBeforePush, function(err, affectedLanderIds) {
        if (err) {
          callback(err);
        } else {
          app.log("affectedLanderIds for delete: " + JSON.stringify(affectedLanderIds), "debug");

          db.getConnection(function(err, connection) {
            if (err) {
              callback(err);
            } else {
              app.log("deleting from snippets where id is = " + snippet_id, "debug");

              connection.query("DELETE FROM snippets WHERE id = ? AND user_id = ?", [snippet_id, user_id],
                function(err, docs) {
                  if (err) {
                    callback(err);
                  } else {
                    callback(false, affectedLanderIds);
                  }
                  //release connection
                  connection.release();
                });
            }
          });
        }
      });
    },

    //edit code requires updating all snippets code on all landers its on  
    saveCode: function(user, params, callback) {
      var user_id = user.id;
      var code = params.code;
      var snippet_id = params.snippet_id;
      var load_before_dom = params.load_before_dom;

      var customBeforePush = function($, callback) {
        //  . add new code to endpoint
        app.log("running custom code before push edit snippet", "debug");

        var scriptTag;
        if (load_before_dom) {
          scriptTag = $("<script id='snippet-" + snippet_id + "' class='ds-no-modify'>" + code + "</script>");
          $('head').append(scriptTag);

        } else {
          scriptTag = $("<script id='snippet-" + snippet_id + "' class='ds-no-modify'>" + code + "</script>");

          $('body').append(scriptTag);
        }

        return;
      };

      module.removeSnippetFromAllEndpointsRunCustomAndPush(user, snippet_id, customBeforePush, function(err, affectedLanderIds) {
        if (err) {
          callback(err);
        } else {
          app.log("affectedLanderIds" + JSON.stringify(affectedLanderIds), "debug");

          db.getConnection(function(err, connection) {
            if (err) {
              callback(err);
            } else {
              connection.query("UPDATE snippets SET code = ? WHERE id = ? AND user_id = ?", [code, snippet_id, user_id],
                function(err, docs) {
                  if (err) {
                    callback(err);
                  } else {
                    callback(false, affectedLanderIds);
                  }
                  //release connection
                  connection.release();
                });
            }
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
            callback(err);
          } else {
            connection.query("SELECT a.url_endpoint_id as urlEndpointId, a.snippet_id, b.lander_id FROM active_snippets a, url_endpoints b WHERE a.id = ? AND a.user_id = ? AND a.url_endpoint_id = b.id", [active_snippet_id, user_id],
              function(err, docs) {
                if (err) {
                  callback(err);
                } else {
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
          app.log("params: " + JSON.stringify(params), "debug");

          db.getConnection(function(err, connection) {
            if (err) {
              callback(err);
            } else {
              connection.query("DELETE FROM active_snippets WHERE id = ? AND user_id = ?", [active_snippet_id, user_id],
                function(err, docs) {
                  if (err) {
                    callback(err);
                  } else {
                    app.log("DELETED! ! success id: " + active_snippet_id, "debug");
                    callback(false, {});
                  }
                  //release connection
                  connection.release();
                });
            }
          });

        });
      });
    }
  };
  return module;
}
