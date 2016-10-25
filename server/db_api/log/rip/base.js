module.exports = function(app, db) {

  return {

    error: function(err, user, stagingDir, landerData, callback) {

      var user_id = user.id;
      var ripped_from = landerData.lander_url;
      var name = landerData.name;
      var s3_folder_name = stagingDir;
      var error = JSON.stringify(err) || err;

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("INSERT INTO ds_log_rip_errors(user_id, name, ripped_from, s3_folder_name, error) VALUES(?,?,?,?,?);", [user_id, name, ripped_from, s3_folder_name, error],
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
  }
};