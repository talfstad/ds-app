define(["app",
  "/assets/js/jobs/jobs_model.js"], 
function(Moonlander, JobsModel){
  Moonlander.module("JobsApp", function(JobsApp, Moonlander, Backbone, Marionette, $, _){

    JobsApp.Controller = {

      startJob: function(guiModel, jobAttributes) {
  
        //create jobs model which is a wrapper model wrapping a job model & gui update model
        var jobsModel = JobsModel({
          guiModel: guiModel,
          jobAttributes: jobAttributes
        });

        var addToUpdater = function(){
          //adds to updater
          Moonlander.updater.add(jobsModel);
          jobsModel.triggerProcessingState();
        };

        if(!jobsModel.get("processing")) {
          jobsModel.save({}, {success: addToUpdater});
        } else {
          addToUpdater();
        }

      }
   

    }
  });

  return Moonlander.JobsApp.Controller;
});