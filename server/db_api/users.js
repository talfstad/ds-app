module.exports = function(app, db) {

  var uuid = require('uuid');
  var bcrypt = require("bcrypt-nodejs");
  var WPhasher = require('wordpress-hash-node');

  return {
    findByIdAndAuth: function(id, auth_token, cb) {
      db.getConnection(function(err, connection) {
        if (err) {
          cb(err, null);
        } else {
          connection.query("SELECT user_id as id,approved,last_login,aws_root_bucket,aws_access_key_id,aws_secret_access_key,auth_token,user_email as user FROM user_settings WHERE user_id = ? AND auth_token = ?;", [id, auth_token], function(err, userDocs) {
            if (err) {
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
          callback(err);
        } else {
          connection.query("SELECT * FROM user_settings WHERE user_id = ?;", [id], function(err, userDocs) {
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
          cb(err);
        } else {
          connection.query("UPDATE user_settings set auth_token = ? WHERE user_id = ?;", [auth_token, user_id], function(err, userDocs) {
            if (err) {
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
          connection.query("SELECT user_id as id, user_pass, user_email FROM user_settings WHERE user_email = ? AND approved = ?;", [username, true], function(err, userDocs) {
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

    findByUsernamePasword: function(username, password, cb) {

      db.getConnection(function(err, connection) {
        if (err) {
          cb(err, null);

        } else {
          connection.query("SELECT user_id as id, user_pass, user_email FROM user_settings WHERE user_email = ?;", [username], function(err, userDocs) {
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
          callback(err);
        } else {
          connection.query("CALL update_api_keys(?, ?, ?);", [user_id, access_key_id, secret_access_key], function(err, docs) {
            if (err) {
              callback(err);
            } else {
              //TODO: validate credentials by creating archive bucket with name user.uid
              callback(false);
            }
            connection.release();
          });
        }
      });
    },

    requestResetPassword: function(email, callback) {
      var code = uuid.v4();
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("SELECT request_reset_password(?, ?) AS value;", [email, code], function(err, docs) {
            if (err) {
              console.log(err);
            } else if (docs != undefined && docs[0] != undefined) {
              var saveCodeSuccessful = docs[0].value;
              if (saveCodeSuccessful) {
                callback(false, code);
              } else {
                callback(true);
              }
            } else {
              callback(true);
            }
            connection.release();
          });
        }
      });
    },

    checkPasswordResetCode: function(code, minutes, callback) {
      db.getConnection(function(err, connection) {
        if (err) {
          callback(err, false);
        } else {
          connection.query("SELECT check_password_reset_code(?, ?) AS value;", [code, minutes], function(err, docs) {
            if (err) {
              callback(err, false);
            } else if (docs != undefined && docs[0] != undefined) {
              var codeIsValid = docs[0].value;
              if (codeIsValid) {
                callback(false, true);
              } else {
                callback(true, false);
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
            } else {
              callback(false, true);
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
          callback(err);
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
                callback(false, access_key_id, secret_access_key, aws_root_bucket)
              } else {
                callback("Unable to get user settings for user: " + user, null);
              }
            } else {
              callback("Unable to get user settings for user: " + user, null);
            }
            connection.release();
          });
        }
      });
    }

  }

};
