module.exports = function(app, db, base) {

  var moment = require('moment');

  return _.extend({

    errorIfTimedOut: function(user, jobId, callback) {
      var user_id = user.id;
      var currentTime = moment.utc(moment());
      var minutesToTimeout = app.config.jobTimeoutLimit / 60 / 1000; //millis to minutes
      var currentTimeMinusTimeout = moment(currentTime).subtract(minutesToTimeout, 'minutes').format("YYYY-M-D H:mm:ss");

      var setErrorIfJobIsTimeout = function() {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            //select job, if we get anything it is timed out
            connection.query("UPDATE jobs SET error = ?, error_code = ?, processing = ? WHERE created_on <= ? AND processing = ? AND error = ? AND done = ? AND id = ? AND user_id = ?", [true, "TimeoutInterrupt", false, currentTimeMinusTimeout, true, false, false, jobId, user_id],
              function(err, docs) {
                if (err) {
                  callback(err);
                } else {
                  if (docs.affectedRows > 0) {
                    //updated job to timed out
                    app.log("updated job to timed out: " + jobId, "debug");
                    callback(false, true);
                  } else {
                    app.log("did not update job to timed out stopping watchdog: " + jobId, "debug");
                    callback(true); //callback as error job is done no more watching
                  }
                }
                connection.release();
              });
          }
        });
      };

      setErrorIfJobIsTimeout();
    }

  }, base.jobs);
};
