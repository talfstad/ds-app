module.exports = function(app, passport) {
  var module = {};

  var config = require("../config");
  var Puid = require('puid');
  var db = require("../db_api");

  app.post('/api/updater', passport.isAuthenticated(), function(req, res) {
    var user = req.user;

    var modelsAttributes = req.body;

    var gotActiveJobsCallback = function(activeJobs) {
      var finishedJobs = [];

      // console.log("active jobs: " + JSON.stringify(activeJobs));

      for (var i = 0; i < modelsAttributes.length; i++) {
        var jobNotFound = true;
        for (var j = 0; j < activeJobs.length; j++) {

          if (modelsAttributes[i].id === activeJobs[j].id) {
            jobNotFound = false;
            
            modelsAttributes[i].deploy_status = activeJobs[j].deploy_status;
            
            if (activeJobs[j].done || activeJobs[j].error) {
              //add to finished, remove from active
              modelsAttributes[i].error = activeJobs[j].error;
              modelsAttributes[i].error_code = activeJobs[j].error_code;
              modelsAttributes[i].done = activeJobs[j].done;
              finishedJobs.push(modelsAttributes[i]);
            }
          }
        }
        if (activeJobs.length <= 0 || jobNotFound) {
          finishedJobs.push(modelsAttributes[i]);
        }
      }

      db.jobs.finishedProcessing(user, finishedJobs, function() {
        //join finished with active jobs to create a complete response
        res.json(modelsAttributes);
      });

    };

    //active jobs have processing=true
    db.updater.getActiveJobs(user, gotActiveJobsCallback);
  });

  return module;

}
