module.exports = function(app, db) {

  var deleteLander = function(user, jobModelAttributes, callback) {

    var WorkerController = require("../../../workers")(app, db);

    //delete lander needs a job list of 1
    var job = jobModelAttributes.list[0];

    var lander_id = job.lander_id;

    db.jobs.cancelAnyCurrentRunningJobsOnLander(user, lander_id, function(err) {
      if (err) {
        callback(err);
      } else {

        //register the delete job
        db.jobs.registerJob(user, job, function(err, registeredJobAttributes) {

          //start the job
          WorkerController.startJob(registeredJobAttributes.action, user, registeredJobAttributes);

          callback(false, [registeredJobAttributes]);
        });
      }
    });

  };

  return deleteLander;
};