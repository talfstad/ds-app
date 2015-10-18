define(["app",
    "/assets/js/apps/jobs/jobs_base_model.js"
  ],
  function(Moonlander, JobsBaseModel) {
    Moonlander.module("JobsApp", function(JobsApp, Moonlander, Backbone, Marionette, $, _) {

      JobsApp.JobsModel = function(options) {
        var guiModel = options.guiModel;
        var jobModel = new JobsBaseModel();

        //create set job model attr
        jobModel.set(options.jobAttributes);


        jobModel.triggerProcessingState = function() {
          guiModel.processingState();
        };

        jobModel.triggerFinishedState = function() {
          guiModel.finishedState();
        };

        jobModel.triggerErrorState = function() {
          guiModel.errorState();
        };

        jobModel.on("change", function(){
          if(!this.get("processing")) {
            if(this.get("error")) {
              jobModel.triggerErrorState();
            }
            else if(this.get("done")) {
              jobModel.triggerFinishedState();
            }
          
            Moonlander.updater.remove(jobModel);
          }
          

        });

        return jobModel;
      }
    });

    return Moonlander.JobsApp.JobsModel;
  });