module.exports = function(db) {

  return {

    updateAccessKeys: function(user, accessKeyId, secretAccessKey, successCallback) {
      var user_id = user.id;

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("UPDATE users SET aws_access_key_id = ?, aws_secret_access_key = ? WHERE id = ?", [accessKeyId, secretAccessKey, user.id],
            function(err, docs) {
              if (err) {
                console.log(err);
                errorCallback("\nError updating aws keys.");
              } else {
                successCallback(docs);
              }
              //release connection
              connection.release();
            });
        }
      });


    },

    updateAccessKeysAndRootBucket: function(user, accessKeyId, secretAccessKey, bucketName, successCallback) {
      var user_id = user.id;

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("UPDATE users SET aws_access_key_id = ?, aws_secret_access_key = ?, aws_root_bucket = ? WHERE id = ?", [accessKeyId, secretAccessKey, bucketName, user.id],
            function(err, docs) {
              if (err) {
                console.log(err);
                errorCallback("\nError updating aws keys.");
              } else {
                successCallback(false, docs);
              }
              //release connection
              connection.release();
            });
        }
      });


    },

    getAmazonApiKeysAndRootBucket: function(user, callback) {
      var user_id = user.id;
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("SELECT aws_access_key_id, aws_secret_access_key, aws_root_bucket FROM users WHERE id=?;", [user_id], function(err, docs) {

            if (docs[0]) {
              callback(docs[0]);
            } else {
              callback("Unable to find Amazon API credentials for user: " + user, null);
            }

            //release connection
            connection.release();
          });
        }
      });
    },

    getAmazonApiKeys: function(user, callback) {
      var user_id = user.id;
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("SELECT aws_access_key_id, aws_secret_access_key FROM users WHERE id=?;", [user_id], function(err, docs) {

            if (docs[0]) {
              callback(docs[0]);
            } else {
              callback("Unable to find Amazon API credentials for user: " + user, null);
            }

            //release connection
            connection.release();
          });
        }
      });
    }

  }
}
