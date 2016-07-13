module.exports = function(app, db) {

  var module = {};

  module.deleteCampaign = function(user, attr) {
    
    var myJobId = attr.id;
    var campaign_id = attr.campaign_id;

    var setErrorAndStop = function(err) {
      var code = err.code || "UnkownError";
      db.jobs.setErrorAndStop(code, myJobId, function(err) {
        console.log("error occured during delete campaign: " + err);
      });
    };

    //poll db for active jobs
    var waitInterval = 1000 * 5; // 5 seconds

    var interval = setInterval(function() {
      //active jobs and wait until all undeploys are complete
      db.jobs.getAllProcessingForCampaign(user, campaign_id, function(err, dbActiveJobs) {
        if (err) {
          setErrorAndStop(err);
        } else {
          if (dbActiveJobs.length <= 0) {
            //finish job success
            clearInterval(interval);
            var finishedJobs = [myJobId];
            db.jobs.finishedJobSuccessfully(user, finishedJobs, function(err) {
              if (err) {
                setErrorAndStop(err)
              } else {
                //5. total success!
                console.log("successfully updated deleteCampaign job to finished");
              }
            });
          }
        }

      });

    }, waitInterval);



  };

  return module.deleteCampaign;

}
