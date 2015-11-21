module.exports = function(db) {

  var utils = require('../utils/utils.js')();

  return {

    updateAccessKeys: function(user, accessKeyId, secretAccessKey, successCallback) {
      var user_id = user.id;

      db.query("UPDATE users SET aws_access_key_id = ?, aws_secret_access_key = ? WHERE id = ?", [accessKeyId, secretAccessKey, user.id],
        function(err, docs) {
          if (err) {
            console.log(err);
            errorCallback("\nError updating aws keys.");
          } else {
            successCallback(docs);
          }
        });


    },

    getAmazonApiKeys: function(user, callback) {
      var user_id = user.id;
        db.query("SELECT aws_access_key_id, aws_secret_access_key FROM users WHERE id=?;", [user_id], function(err, docs) {
            
            if (docs[0]) {
                    callback(docs[0]);
            } else {
                callback("Unable to find Amazon API credentials for user: " + user, null);
            }
        });
    }

  }
}
