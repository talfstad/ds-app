define(["app",
    "assets/js/jobs/jobs_controller",
    "assets/js/common/login/common_login"
  ],
  function(Moonlander, JobsController, CommonLogin) {
    Moonlander.module("JobsApp", function(JobsApp, Moonlander, Backbone, Marionette, $, _) {

      var jobsAppAPI = {
        startJob: function(jobModel, newJobAddedSuccessCallback) {
          CommonLogin.Check(function() {
            JobsController.startJob(jobModel, newJobAddedSuccessCallback);
          });
        },
        startNextJob: function(jobCollection) {
          CommonLogin.Check(function() {
            JobsController.startNextJob(jobCollection);
          });
        }
      };

      Moonlander.on("job:start", function(jobModelOrAttr) {
        if (jobModelOrAttr.onSuccess) {
          //its attr which means it has a jobModel attached to it
          jobsAppAPI.startJob(jobModelOrAttr.jobModel, jobModelOrAttr.onSuccess);
        } else {
          //its just a jobModel without a need for a callback
          jobsAppAPI.startJob(jobModelOrAttr);
        }
      });
      Moonlander.on("job:startNext", function(jobCollection) {
        jobsAppAPI.startNextJob(jobCollection);
      });
    });

    return Moonlander.JobsApp;
  });
