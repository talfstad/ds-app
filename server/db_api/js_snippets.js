module.exports = function(db) {

  return {

    saveNewSnippet: function(user, attr, successCallback) {
      var user_id = user.id;

      var code = "";
      var name = attr.name;
      var description = attr.description;

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        }
        connection.query("call add_new_snippet(?, ?, ?)", [user_id, name, description], function(err, docs) {
          if (err) {
            console.log(err);
          } else {
            successCallback({
              id: docs[0][0]["LAST_INSERT_ID()"]
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
          connection.query("SELECT id, code, name, for_everyone, description FROM snippets WHERE user_id = ? OR for_everyone = ?", [user_id, true], function(err, dbsnippets) {
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

    removeActiveSnippet: function(user, active_snippet_id, successCallback) {
      var user_id = user.id;

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("DELETE FROM active_snippets WHERE id = ? AND user_id = ?", [active_snippet_id, user_id],
            function(err, docs) {
              if (err) {
                console.log(err);
                errorCallback("\nError remove active snippet id: " + active_snippet_id + " for user: " + user_id + ".");
              } else {
                successCallback({});
              }
              //release connection
              connection.release();
            });
        }
      });


    },

    saveEditInfo: function(user, params, successCallback) {
      var description = params.description;
      var name = params.name;
      var snippet_id = params.snippet_id;
      var user_id = user.id;

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("UPDATE snippets SET name = ?, description = ? WHERE id = ? AND user_id = ?", [name, description, snippet_id, user_id],
            function(err, docs) {
              if (err) {
                console.log(err);
                errorCallback("\nError updating snippet information.");
              } else {
                successCallback(docs);
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

    //add this snippet to active snippets
    addSnippetToUrlEndpoint: function(user, params, successCallback) {
      var snippet_id = params.snippet_id
      var urlEndpointId = params.urlEndpointId
      var user_id = user.id

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        }
        connection.query("call add_snippet_to_url_endpoint(?, ?, ?)", [snippet_id, urlEndpointId, user_id], function(err, docs) {
          if (err) {
            console.log(err);
          } else {
            successCallback({
              id: docs[0][0]["LAST_INSERT_ID()"]
            });
          }
          connection.release();
        });
      });


    }

  }
}
