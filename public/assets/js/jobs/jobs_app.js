define(["app",
  "/assets/js/jobs/jobs_controller.js",
  "/assets/js/common/login/common_login.js"
  ], 
function(Moonlander, JobsController, CommonLogin){
  Moonlander.module("JobsApp", function(JobsApp, Moonlander, Backbone, Marionette, $, _){

    var jobsAppAPI = {
      startJob: function(jobModel){
        CommonLogin.Check(function(){
          JobsController.startJob(jobModel);
        });
      },
      startNextJob: function(jobCollection){
        CommonLogin.Check(function(){
          JobsController.startNextJob(jobCollection);
        });
      }
    };

    Moonlander.on("job:start", function(jobModel){
      jobsAppAPI.startJob(jobModel);
    });
    Moonlander.on("job:startNext", function(jobCollection){
      jobsAppAPI.startNextJob(jobCollection);
    });
  });

  return Moonlander.JobsApp;
});