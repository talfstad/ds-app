module.exports = function(db) {

  var utils = require('../utils/utils.js')();
  var uuid = require('uuid');
  var config = require("../config");
  var bcrypt = require("bcrypt-nodejs");

  return {
    findById: function(id, cb) {
      db.query("SELECT * FROM users WHERE id = ?;", [id], function(err, userDocs) {
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
      });
    },

    findByUsername: function(username, password, cb) {
      
      db.query("SELECT * FROM users WHERE user = ?;", [username], function(err, userDocs) {
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
            }
          }
        }
      });
    },

    addUser: function(username, hash, uid, callback) {
      var error;
      db.query("INSERT INTO users(user, hash, approved, uid) VALUES (?, ?, ?, ?);", [username, hash, 0, uid], function(err, docs) {
        if (err) {
          console.log(err);
          error = "Username invalid or already taken";
          callback(error)
        } else {
          
        }
      });
    },

    addAmazonAPIKeys: function(access_key_id, secret_access_key, user, callback) {
        db.query("CALL update_api_key(?, ?, ?);", [user, access_key_id, secret_access_key], function(err, docs) {
            if (err) {
                console.log(err);
                callback("Cannot update Amazon access key ID and secret_access_key for user: " + user);
            } else {
                //TODO: validate credentials
                callback(err);
            }
        });
    },

    requestResetPassword: function(user, callback) {
        var code = uuid.v4();
        db.query("SELECT request_reset_password(?, ?) AS value;", [user, code], function(err, docs) {
            if (err) {
                console.log(err);
                callback("Unable to reset pw for user: " + user, code);
            } 
            else if(docs != undefined && docs[0] != undefined) {
                var response_string = docs[0].value;
                if(response_string == "SUCCESS") {
                    callback(err, code);
                }
                else {
                    console.log("User not found: " + user);
                    callback("User not found; please register on the signup page.");
                }
            }
            else {
                callback("Something went wrong.");
            }
        });
    },

    checkPasswordResetCode: function(code, minutes, callback) {
        db.query("SELECT check_password_reset_code(?, ?) AS value;", [code, minutes], function(err, docs) {
            if (err) {
                console.log(err);
                callback("Error checking password reset code", false);
            } 
            else if(docs != undefined && docs[0] != undefined) {
                var response_string = docs[0].value;
                if(response_string == "VALID") {
                    callback({}, true);
                }
                else if(response_string == "INVALID") {
                    callback("Reset password code is invalid.", false);
                }
                else if(response_string == "EXPIRED") {
                    callback("Reset password code has expired. Each code expires after " + (config.resetCodeLifespanMinutes / 60) + " hours.", false);
                }
                else {
                    callback("Reset password code is invalid.", false);
                }
            }
            else {
                callback(err, false);
            }
        });
    },

    resetPassword: function(code, hash, callback) {
        db.query("CALL reset_password(?, ?);", [code, hash], function(err, docs) {
            if (err) {
                console.log(err);
                callback("Unable to reset pw for user: " + user);
            } else {
                callback(err);
            }
        });
    }

  }

};
