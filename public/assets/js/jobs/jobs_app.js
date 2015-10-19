define(["app",
  "/assets/js/jobs/jobs_controller.js",
  "/assets/js/common/login/common_login.js"
  ], 
function(Moonlander, JobsController, CommonLogin){
  Moonlander.module("JobsApp", function(JobsApp, Moonlander, Backbone, Marionette, $, _){

    var jobsAppAPI = {
      startJob: function(guiModel, jobAttributes){
        CommonLogin.Check(function(){
          JobsController.startJob(guiModel, jobAttributes);
        });
      }
    };

    Moonlander.on("job:start", function(guiModel, jobAttributes){
      jobsAppAPI.startJob(guiModel, jobAttributes);
    });
  });

  return Moonlander.JobsApp;
});