module.exports = function(app, db) {
  var path = require("path");
  var fs = require("fs");

  var module = {
    
    error: function(err, user, s3DownloadUrl, callback) {

      var user_id = user.id;
      var error = JSON.stringify(err) || err;

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("INSERT INTO ds_log_add_lander_errors(user_id, download_url, error) VALUES(?,?,?);", [user_id, s3DownloadUrl, error],
            function(err, docs) {
              if (err) {
                callback(err);
              } else {
                callback(false);
              }
              connection.release();
            });
        }
      });
    }
  };

  return module;
};
