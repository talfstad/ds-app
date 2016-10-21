module.exports = function(app, dbApi, Worker, controller) {

  var deleteDomain = function(user, jobModelAttributes, callback) {

    //delete lander needs a job list of 1
    var job = jobModelAttributes.list[0];

    var group_id = job.group_id;





    //register the delete job
    dbApi.jobs.registerJob(user, job, function(err, registeredJobAttributes) {

      //start the job
      Worker.startJob(registeredJobAttributes.action, user, registeredJobAttributes);

      callback(false, [registeredJobAttributes]);
    });


  };

  return deleteDomain;
};
