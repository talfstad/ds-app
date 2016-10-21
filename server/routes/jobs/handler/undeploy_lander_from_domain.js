module.exports = function(app, dbApi, Worker, controller) {

  var undeployLanderFromDomain = function(user, jobModelAttributes, callback) {

    var list = jobModelAttributes.list;
    
    //if any of these jobs have the same action or deployLanderToDomain, domain_id and lander_id then we
    // update the current ones to error=1 and code = "ExternalInterrupt"
    dbApi.jobs.cancelAnyCurrentRunningDuplicateJobs(user, list, function(err) {
      if (err) {
        callback(err);
      } else {

        //register first job and assign as master
        var firstJobAttributes = list.shift();
        var finalList = [];

        dbApi.jobs.registerJob(user, firstJobAttributes, function(err, registeredMasterJobAttributes) {
          //start the first job (master job)

          Worker.startJob(registeredMasterJobAttributes.action, user, { job: registeredMasterJobAttributes });

          finalList.push(registeredMasterJobAttributes);
          var masterJobId = registeredMasterJobAttributes.id;

          //call register job in for loop with async index
          if (list.length > 0) {
            var asyncIndex = 0;
            for (var i = 0; i < list.length; i++) {

              list[i].master_job_id = masterJobId;

              dbApi.jobs.registerJob(user, list[i], function(err, registeredSlaveJobAttributes) {

                finalList.push(registeredSlaveJobAttributes);

                //start slave job
                Worker.startJob(registeredSlaveJobAttributes.action, user, { job: registeredSlaveJobAttributes });

                if (++asyncIndex == list.length) {
                  callback(false, finalList);
                }
              });
            }
          } else {
            callback(false, finalList);
          }
        });
      }
    });
  };

  return undeployLanderFromDomain;

};
