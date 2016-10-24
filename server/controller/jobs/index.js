module.exports = function(app, dbApi, awsApi) {

  return _.extend({

  	//watches for a job to time out and calls its cleanup function.
  	// doesn't call its cleanup function if job finishes on its own
    //dont have to callback just ave to update the job !! job will cancel on its own
    watchDog: function(user, jobId, callback) {
      
      var intervalLength = app.config.jobTimeoutLimit;

      var poll = function() {
        setTimeout(function() {
          dbApi.jobs.errorIfTimedOut(user, jobId, function(err, isTimedOut) {
            //nothing. no need to poll because interval length is timeout length
          });
        }, intervalLength);
      };

      poll();
    }

  }, {});
};
