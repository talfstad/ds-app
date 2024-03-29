module.exports = function(app, dbApi, controller) {

  var module = {};

  module.deleteGroup = function(user, attr) {
    
    var myJobId = attr.id;
    var group_id = attr.group_id;

    var setErrorAndStop = function(err) {
      var code = err.code || "UnkownError";
      dbApi.jobs.setErrorAndStop(code, myJobId, function(err) {
        app.log("error occured during delete group: " + err, "debug");
      });
    };

    //poll db for active jobs
    var waitInterval = 1000 * 5; // 5 seconds

    var interval = setInterval(function() {
      //active jobs and wait until all undeploys are complete
      dbApi.jobs.getAllProcessingForGroup(user, group_id, function(err, dbActiveJobs) {
        if (err) {
          setErrorAndStop(err);
        } else {
          if (dbActiveJobs.length <= 0) {
            //finish job success
            clearInterval(interval);
            var finishedJobs = [myJobId];
            dbApi.jobs.finishedJobSuccessfully(user, finishedJobs, function(err) {
              if (err) {
                setErrorAndStop(err)
              } else {
                //5. total success!
                app.log("successfully updated deleteGroup job to finished", "debug");
              }
            });
          }
        }

      });

    }, waitInterval);



  };

  return module.deleteGroup;

}
