module.exports = function(app, db) {

  return {

    releaseLockForS3: function(lander_id, callback) {
      console.log("LANDER ID : " + lander_id);

      if (!lander_id) {
        callback(false);
        return;
      }

      var releaseLockDb = function(callback) {
        app.log("lander_id: " + lander_id + " releasing lock for s3", "debug");
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("UPDATE landers SET currently_using_s3_lock = ? WHERE id = ?", [false, lander_id],
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
      };

      releaseLockDb(function(err) {
        if (err) {
          callback(err);
        } else {
          callback(false);
        }
      });

    },

    getLockForS3: function(lander_id, callback) {
      console.log("LANDER ID : " + lander_id);

      if (!lander_id) {
        callback(false);
        return;
      }

      var getLockFromDb = function(callback) {

        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT currently_using_s3_lock FROM landers WHERE id = ?", [lander_id],
              function(err, docs) {
                if (err) {
                  callback(err);
                } else {
                  callback(false, docs[0]);
                }
                connection.release();
              });
          }
        });
      };

      var lockDb = function(callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("UPDATE landers SET currently_using_s3_lock = ? WHERE id = ?", [true, lander_id],
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
      };

      var getLock = function() {
        getLockFromDb(function(err, data) {
          if (err) {
            callback(err);
          } else {
            setTimeout(function() {
              app.log("lander_id: " + lander_id + " getting lock for s3: " + data.currently_using_s3_lock, "debug");
              if (!data.currently_using_s3_lock) {
                lockDb(function(err) {
                  if (err) {
                    callback(err);
                  } else {
                    callback(false);
                  }
                });
              } else {
                getLock();
              }
            }, app.config.s3.getLockPollDuration);
          }
        });
      };

      getLock();

    },



  }
};
