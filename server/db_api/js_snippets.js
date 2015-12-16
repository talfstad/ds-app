module.exports = function(db) {

  return {

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
              for(var i=0 ; i<dbsnippets.length ; i++){
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
