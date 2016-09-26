module.exports = function(app, db) {

  var deleteDomain = function(user, jobModelAttributes, callback) {

    var WorkerController = require("../../../workers")(app, db);

    //delete lander needs a job list of 1
    var job = jobModelAttributes.list[0];

    var group_id = job.group_id;





    //register the delete job
    db.jobs.registerJob(user, job, function(err, registeredJobAttributes) {

      //start the job
      WorkerController.startJob(registeredJobAttributes.action, user, registeredJobAttributes);

      callback(false, [registeredJobAttributes]);
    });


  };

  return deleteDomain;
};
