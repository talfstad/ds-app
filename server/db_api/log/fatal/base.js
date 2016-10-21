module.exports = function(app, db) {

  var module = {

    error: function(err, callback) {

      var error = JSON.stringify(err) || err;

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("INSERT INTO ds_log_fatal_errors(error) VALUES(?);", [error],
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

  return module;
};
