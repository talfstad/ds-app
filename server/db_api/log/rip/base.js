module.exports = function(app, db) {

  return {

    error: function(err, user, landerData, callback) {

      var user_id = user.id;
      var ripped_from = landerData.lander_url;
      var name = landerData.name;
      var error = JSON.stringify(err) || err;

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("INSERT INTO ds_log_rip_errors(user_id, name, ripped_from, error) VALUES(?,?,?,?);", [user_id, name, ripped_from, error],
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