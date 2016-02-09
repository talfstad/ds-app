module.exports = function(db) {

  var utils = require('../utils/utils.js')();
  var uuid = require('uuid');
  var config = require("../config");
  var bcrypt = require("bcrypt-nodejs");

  return {
    findByIdAndAuth: function(id, auth_token, cb) {
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("SELECT * FROM users WHERE id = ? AND auth_token = ?;", [id, auth_token], function(err, userDocs) {
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

    setAuthToken: function(user_id, auth_token, cb) {
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("UPDATE users set auth_token = ? WHERE id = ?;", [auth_token, user_id], function(err, userDocs) {
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

    findByUsername: function(username, password, cb) {

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("SELECT * FROM users WHERE user = ?;", [username], function(err, userDocs) {
            if (err) {
              console.log(err);
              cb("Error looking up user", null);
            } else {
              if (!userDocs[0]) {
                cb("Invalid user or password", null);
              } else {
                var user_row = userDocs[0];
                if (bcrypt.compareSync(password, user_row.hash)) {
                  cb(null, user_row);
                } else {
                  cb("Invalid user or password", null);
                }
              }
            }
            connection.release();
          });
        }
      });
    },

    addUser: function(username, hash, uid, callback) {
      var error;
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("INSERT INTO users(user, hash, approved, uid) VALUES (?, ?, ?, ?);", [username, hash, 0, uid], function(err, docs) {
            if (err) {
              console.log(err);
              error = "Username invalid or already taken";
              callback(error)
            } else {

            }
            connection.release();
          });
        }
      });
    },

    addAmazonAPIKeys: function(access_key_id, secret_access_key, user, callback) {
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("CALL update_api_keys(?, ?, ?);", [user, access_key_id, secret_access_key], function(err, docs) {
            if (err) {
              console.log(err);
              callback("Cannot update Amazon access key ID and secret_access_key for user: " + user);
            } else {
              //TODO: validate credentials by creating archive bucket with name user.uid
              callback(err);
            }
            connection.release();
          });
        }
      });
    },

    requestResetPassword: function(user, callback) {
      var code = uuid.v4();
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("SELECT request_reset_password(?, ?) AS value;", [user, code], function(err, docs) {
            if (err) {
              console.log(err);
              callback("Unable to reset pw for user: " + user, code);
            } else if (docs != undefined && docs[0] != undefined) {
              var response_string = docs[0].value;
              if (response_string == "SUCCESS") {
                callback(err, code);
              } else {
                console.log("User not found: " + user);
                callback("User not found; please register on the signup page.");
              }
            } else {
              callback("Something went wrong.");
            }
            connection.release();
          });
        }
      });
    },

    checkPasswordResetCode: function(code, minutes, callback) {
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("SELECT check_password_reset_code(?, ?) AS value;", [code, minutes], function(err, docs) {
            if (err) {
              console.log(err);
              callback("Error checking password reset code", false);
            } else if (docs != undefined && docs[0] != undefined) {
              var response_string = docs[0].value;
              if (response_string == "VALID") {
                callback(null, true);
              } else if (response_string == "INVALID") {
                callback("Reset password code is invalid.", false);
              } else if (response_string == "EXPIRED") {
                callback("Reset password code has expired. Each code expires after " + (config.resetCodeLifespanMinutes / 60) + " hours.", false);
              } else {
                callback("Reset password code is invalid.", false);
              }
            } else {
              callback(err, false);
            }
            connection.release();
          });
        }
      });
    },

    resetPassword: function(code, hash, callback) {
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("CALL reset_password(?, ?);", [code, hash], function(err, docs) {
            if (err) {
              console.log(err);
              callback("Unable to reset pw for user: " + user);
            } else {
              callback(err);
            }
            connection.release();
          });
        }
      });
    },

    getUserUid: function(user, callback) {
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("SELECT uid FROM users WHERE user=?;", [user], function(err, docs) {
            if (docs[0]) {
              callback(null, docs[0].uid)
            } else {
              callback("Unable to find uid for user: " + user, null);
            }
            connection.release();
          });
        }
      });
    },

    getAmazonAPIKeys: function(user, callback) {
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("SELECT aws_access_key_id, aws_secret_access_key FROM users WHERE user=?;", [user], function(err, docs) {
            if (docs[0]) {
              if (!docs[0].access_key_id) {
                callback("Amazon access key id not set.", null, null);
              } else if (!docs[0].secret_access_key) {
                callback("Amazon secret access not set.", null, null);
              } else {
                callback(null, docs[0].access_key_id, docs[0].secret_access_key);
              }
            } else {
              callback("Unable to find Amazon API credentials for user: " + user, null);
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
          connection.query("SELECT aws_access_key_id, aws_secret_access_key, uid FROM users WHERE id=?;", [user_id], function(err, docs) {
            if (!err) {
              var access_key_id = null;
              var secret_access_key = null;
              var uid = null;
              if (docs[0]) {
                if (docs[0].aws_access_key_id) {
                  access_key_id = docs[0].aws_access_key_id;
                }
                if (docs[0].aws_secret_access_key) {
                  secret_access_key = docs[0].aws_secret_access_key;
                }
                if (docs[0].uid) {
                  uid = docs[0].uid;
                }
                callback(null, access_key_id, secret_access_key, uid)
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
