module.exports = function(app, dbApi, Worker, controller) {

  var deleteDomain = function(user, jobModelAttributes, callback) {

    //delete lander needs a job list of 1
    var job = jobModelAttributes.list[0];

    var domain_id = job.domain_id;

    dbApi.jobs.cancelAnyCurrentRunningJobsOnDomain(user, domain_id, function(err) {
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

  return deleteDomain;
};