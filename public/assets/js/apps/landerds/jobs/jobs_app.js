define(["app",
    "assets/js/apps/landerds/jobs/jobs_controller",
    "assets/js/apps/landerds/common/login/common_login"
  ],
  function(Landerds, JobsController, CommonLogin) {
    Landerds.module("JobsApp", function(JobsApp, Landerds, Backbone, Marionette, $, _) {

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

      Landerds.on("job:start", function(jobModelOrAttr) {
        if (jobModelOrAttr.onSuccess) {
          //its attr which means it has a jobModel attached to it
          jobsAppAPI.startJob(jobModelOrAttr.jobModel, jobModelOrAttr.onSuccess);
        } else {
          //its just a jobModel without a need for a callback
          jobsAppAPI.startJob(jobModelOrAttr);
        }
      });
      Landerds.on("job:startNext", function(jobCollection) {
        jobsAppAPI.startNextJob(jobCollection);
      });
    });

    return Landerds.JobsApp;
  });
