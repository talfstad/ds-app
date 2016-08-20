module.exports = function(app, passport) {
  var module = {};

  var Puid = require('puid');
  var db = require("../db_api")(app);

  app.post('/api/updater', passport.isAuthenticated(), function(req, res) {
    var user = req.user;

    var modelsAttributes = req.body;

    var gotActiveJobsCallback = function(err, activeJobs) {
      if (err) {
        res.json({ code: "CouldNotGetActiveJobs" });
      } else {

        var finishedJobs = [];

        for (var i = 0; i < modelsAttributes.length; i++) {
          var jobFound = false;
          for (var j = 0; j < activeJobs.length; j++) {

            if (modelsAttributes[i].id === activeJobs[j].id) {
              jobFound = true;

              modelsAttributes[i].deploy_status = activeJobs[j].deploy_status;

              //add extra update stuff for various models
              if (activeJobs[j].extra) {
                modelsAttributes[i].extra = activeJobs[j].extra;
              }

              if (activeJobs[j].done || activeJobs[j].error) {
                //add to finished, remove from active
                modelsAttributes[i].error = activeJobs[j].error;
                modelsAttributes[i].error_code = activeJobs[j].error_code;
                modelsAttributes[i].done = activeJobs[j].done;
                finishedJobs.push(modelsAttributes[i]);
              }
            }
          }

          if (activeJobs.length <= 0 || !jobFound) {
            finishedJobs.push(modelsAttributes[i]);
          }
        }

        db.jobs.finishedProcessing(user, finishedJobs, function() {
          //join finished with active jobs to create a complete response


          res.json(modelsAttributes);
        });
      }
    };

    //active jobs have processing=true
    db.updater.getActiveJobs(modelsAttributes, user, gotActiveJobsCallback);
  });

  return module;

}
