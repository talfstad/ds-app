module.exports = function(db) {

  return {

    updateAccessKeys: function(user, accessKeyId, secretAccessKey, successCallback) {
      var user_id = user.id;

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("UPDATE user_settings SET aws_access_key_id = ?, aws_secret_access_key = ? WHERE user_id = ?", [accessKeyId, secretAccessKey, user.id],
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
          connection.query("UPDATE user_settings SET aws_access_key_id = ?, aws_secret_access_key = ?, aws_root_bucket = ? WHERE user_id = ?", [accessKeyId, secretAccessKey, bucketName, user.id],
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
          callback(err);
        } else {
          connection.query("SELECT aws_access_key_id, aws_secret_access_key, aws_root_bucket FROM user_settings WHERE user_id = ?;", [user_id], function(err, docs) {

            if (docs[0]) {
              callback(false, docs[0]);
            } else {
              callback({
                code: "CredentialsNotFound"
              }, null);
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
          connection.query("SELECT aws_access_key_id, aws_secret_access_key FROM user_settings WHERE user_id = ?;", [user_id], function(err, docs) {

            if (docs[0]) {
              callback(false, docs[0]);
            } else {
              callback({
                code: "CredentialsNotFound"
              }, null);
            }

            //release connection
            connection.release();
          });
        }
      });
    }

  }
}
