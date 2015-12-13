module.exports = function(db) {

  return {

    getAll: function(user, successCallback) {

      var user_id = user.id;

      var getAllJsSnippetsDb = function(gotSnippetsCallback) {
        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          }
          connection.query("SELECT * FROM snippets WHERE user_id = ? OR for_everyone = ?", [user_id, true], function(err, dbsnippets) {
            if (err) {
              console.log(err);
            } else {
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

    }

  }
}
