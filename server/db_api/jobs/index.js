module.exports = function(app, db, base) {
	
  var moment = require('moment');

  return _.extend({

    errorIfTimedOut: function(callback) {
      var currentTime = moment.utc(moment());
      var minutesToTimeout = app.config.jobTimeoutLimit / 60 / 1000; //millis to minutes
      var currentTimeMinusTimeout = moment(currentTime).subtract(minutesToTimeout, 'minutes').format("YYYY-M-D H:mm:ss");

      var selectRowsToUpdate = function(callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT * FROM jobs WHERE created_on < ? AND processing = ? AND error = ? AND done = ?;", [currentTimeMinusTimeout, true, false, false],
              function(err, docs) {
                if (err) {
                  callback(err);
                } else {
                  callback(false, docs);
                }
                connection.release();
              });
          }
        });
      };

      var deleteLander = function(job, callback) {
        if (job.user_id && job.lander_id) {
          base.landers.deleteLander({ id: job.user_id }, job.lander_id, function() {
            callback(false);
          });
        } else {
          callback();
        }
      };

      var logError = function(job, callback) {
        var user = { id: job.user_id };
        var stagingPath = job.staging_path;

        var landerData = {
          id: job.lander_id
        };

        var landersToGetArr = [{
          lander_id: job.lander_id
        }];

        if (job.action == "ripLander") {
          base.landers.getAll(user, function(err, landers) { //to get the ripped_from for log
            var lander = landers[0];
            landerData.lander_url = lander.ripped_from;
            base.log.rip.error({ code: "TimeoutInterrupt" }, user, stagingPath, landerData, function(err) {
              callback();
            });
          }, landersToGetArr);
        } else if (job.action == "addLander") {
          //TODO: log add lander on fail here
          callback();

        }
      };

      var deleteTimedoutLanders = function(jobsToUpdate, callback) {
        var deleteLandersArr = [];
        _.each(jobsToUpdate, function(job) {
          if (job.action == "addLander" || job.action == "ripLander") {
            deleteLandersArr.push(job);
          }
        });

        var idx = 0;
        _.each(deleteLandersArr, function(job) {
          logError(job, function() {
            deleteLander(job, function() {
              if (++idx == deleteLandersArr.length) {
                callback(false);
              }
            });
          });
        });
      };


      var setErrorIfJobIsTimeout = function() {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            selectRowsToUpdate(function(err, jobsToUpdate) {
              deleteTimedoutLanders(jobsToUpdate, function() {
                connection.query("UPDATE jobs SET error = ?, error_code = ? WHERE created_on < ? AND processing = ? AND error = ? AND done = ?;", [true, "TimeoutInterrupt", currentTimeMinusTimeout, true, false, false],
                  function(err, docs) {
                    if (err) {
                      callback(err);
                    } else {
                      callback(false);
                    }
                    connection.release();
                  });
              });
            });
          }
        });
      };

      setErrorIfJobIsTimeout();
    }

  }, base.jobs);
};
