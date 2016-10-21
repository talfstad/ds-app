module.exports = function(app, passport, dbApi, controller) {
  var module = {};

  var Puid = require('puid');
  
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
          if (activeJobs.length > 0) {

            for (var j = 0; j < activeJobs.length; j++) {

              if (modelsAttributes[i].id === activeJobs[j].id) {
                jobFound = true;

                modelsAttributes[i].deploy_status = activeJobs[j].deploy_status;

                //add extra update stuff for various models
                if (activeJobs[j].extra) {
                  modelsAttributes[i].extra = activeJobs[j].extra;
                }

                if (activeJobs[j].done || activeJobs[j].error) {
                  modelsAttributes[i].error = activeJobs[j].error;
                  modelsAttributes[i].error_code = activeJobs[j].error_code;
                  modelsAttributes[i].done = activeJobs[j].done;
                }
                modelsAttributes[i].processing = activeJobs[j].processing;
              }
            }
          } else {
            modelsAttributes[i].processing = false;
          }
        }

        res.json(modelsAttributes);
      }
    };

    //active jobs have processing=true
    dbApi.updater.getActiveJobs(modelsAttributes, user, gotActiveJobsCallback);
  });

  return module;

}
