module.exports = function(db) {

  var uuid = require('uuid');
  var bcrypt = require("bcrypt-nodejs");
  var WPhasher = require('wordpress-hash-node');

  return {
    findByIdAndAuth: function(id, auth_token, cb) {
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          //join wp_users and users on the user_id to get the auth token with the id
          //if row is auto created when wp_users row created then we dont need a join
          connection.query("SELECT a.user_id as id,a.approved,a.last_login,a.aws_root_bucket,a.aws_access_key_id,a.aws_secret_access_key,a.auth_token,b.user_email as user FROM user_settings a JOIN wp_users b ON (a.user_id = b.id) WHERE a.user_id = ? AND a.auth_token = ?;", [id, auth_token], function(err, userDocs) {
            if (err) {
              console.log(err);
              cb("Error looking up user id", null);
            } else {
              if (!userDocs[0]) {
                cb("Error looking up user id", null);
              } else {
                var user_row = userDocs[0];
                cb(null, user_row);
              }
            }
            connection.release();
          });
        }
      });
    },

    findById: function(id, callback) {
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("SELECT * FROM wp_users WHERE ID = ?;", [id], function(err, userDocs) {
            if (err) {
              callback("Error looking up user id", null);
            } else {
              if (!userDocs[0]) {
                callback("Error looking up user id", null);
              } else {
                var user_row = userDocs[0];
                callback(null, user_row);
              }
            }
            connection.release();
          });
        }
      });
    },

    setAuthToken: function(user_id, auth_token, cb) {
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("UPDATE user_settings set auth_token = ? WHERE user_id = ?;", [auth_token, user_id], function(err, userDocs) {
            if (err) {
              console.log(err);
              cb(err);
            } else {
              cb(false);
            }
            connection.release();
          });
        }
      });
    },

    findByUsernamePaswordApproved: function(username, password, cb) {

      db.getConnection(function(err, connection) {
        if (err) {
          cb(err, null);

        } else {
          connection.query("SELECT a.ID as id, a.user_pass, a.user_email FROM wp_users a JOIN user_settings b ON (a.ID=b.user_id) WHERE a.user_email = ? AND b.approved = ?;", [username, 1], function(err, userDocs) {
            if (err) {
              cb({ code: "ErrorFindingUserDb" }, null);
            } else {
              if (!userDocs[0]) {
                cb("Invalid user or password", null);
              } else {
                var user_row = userDocs[0];
                if (WPhasher.CheckPassword(password, user_row.user_pass)) {
                  cb(null, user_row);
                } else {
                  cb({ code: "InvalidPassword" }, null);
                }
              }
            }
            connection.release();
          });
        }
      });
    },

    addAmazonAPIKeys: function(access_key_id, secret_access_key, user, callback) {
      var user_id = user.id;
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("CALL update_api_keys(?, ?, ?);", [user_id, access_key_id, secret_access_key], function(err, docs) {
            if (err) {
              console.log(err);
              callback("Cannot update Amazon access key ID and secret_access_key for user: " + user);
            } else {
              //TODO: validate credentials by creating archive bucket with name user.uid
              callback(false);
            }
            connection.release();
          });
        }
      });
    },

    getUserSettings: function(user, callback) {
      var user_id = user.id;
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("SELECT aws_access_key_id, aws_secret_access_key, aws_root_bucket FROM user_settings WHERE user_id = ?;", [user_id], function(err, docs) {
            if (!err) {
              var access_key_id = null;
              var secret_access_key = null;
              var aws_root_bucket = null;
              if (docs[0]) {

                if (docs[0].aws_access_key_id) {
                  access_key_id = docs[0].aws_access_key_id;
                }
                if (docs[0].aws_secret_access_key) {
                  secret_access_key = docs[0].aws_secret_access_key;
                }
                if (docs[0].aws_root_bucket) {
                  aws_root_bucket = docs[0].aws_root_bucket;
                }
                callback(null, access_key_id, secret_access_key, aws_root_bucket)
              } else {
                callback("Unable to get user settings for user: " + user, null);
              }
            } else {
              console.log(err);
              callback("Unable to get user settings for user: " + user, null);
            }
            connection.release();
          });
        }
      });
    }

  }

};
