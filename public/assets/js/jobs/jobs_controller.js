define(["app"], 
function(Moonlander){
  Moonlander.module("JobsApp", function(JobsApp, Moonlander, Backbone, Marionette, $, _){

    JobsApp.Controller = {

      startJob: function(jobModel) {

        var addToUpdater = function(jobModelWithId){
          //adds to updater
          var model = (jobModelWithId ? jobModelWithId : jobModel);
          
          Moonlander.updater.add(model);
        };

        //there won't be an ID on a new job, and only should start it if
        // it's processing and currently being worked on
        if(!jobModel.get("processing") && !jobModel.get("id")) {
          jobModel.save({}, {
            success: function(model, response){
              addToUpdater(model, response);
            }
          });
        } else {
          addToUpdater();
        }
      }
    }
  });

  return Moonlander.JobsApp.Controller;
});