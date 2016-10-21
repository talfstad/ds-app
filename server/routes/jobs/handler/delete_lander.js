module.exports = function(app, dbApi, Worker, controller) {

  var deleteLander = function(user, jobModelAttributes, callback) {

    //delete lander needs a job list of 1
    var job = jobModelAttributes.list[0];

    var lander_id = job.lander_id;

    dbApi.jobs.cancelAnyCurrentRunningJobsOnLander(user, lander_id, function(err) {
      if (err) {
        callback(err);
      } else {

        //register the delete job
        dbApi.jobs.registerJob(user, job, function(err, registeredJobAttributes) {

          //start the job
          Worker.startJob(registeredJobAttributes.action, user, registeredJobAttributes);

          callback(false, [registeredJobAttributes]);
        });
      }
    });

  };

  return deleteLander;
};