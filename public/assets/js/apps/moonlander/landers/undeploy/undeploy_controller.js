define(["app",
        "/assets/js/apps/moonlander/landers/undeploy/views/undeploy_layout_view.js",
        "/assets/js/jobs/jobs_model.js"], 
function(Moonlander, UndeployLayoutView, JobModel){
  Moonlander.module("LandersApp.Landers.Undeploy", function(Undeploy, Moonlander, Backbone, Marionette, $, _){

    Undeploy.Controller = {
      
      showUndeployLander: function(model){
        
        var undeployLanderLayout = new UndeployLayoutView({
          model: model
        });
        undeployLanderLayout.render();
       
        Moonlander.rootRegion.currentView.modalRegion.show(undeployLanderLayout);


        undeployLanderLayout.on("undeployLanderFromDomain", function(model){

          var jobAttributes = {
            action: "undeployLanderFromDomain",
            lander_id: model.get("lander_id"),
            domain_id: model.get("id"),
          }

          //create job and add to models activeJobs
          var jobModel = new JobModel(jobAttributes);
          var activeJobsCollection = this.model.get("activeJobs");
          activeJobsCollection.add(jobModel);

          Moonlander.trigger("job:start", jobModel);    

        });
        
      }

    }
  });

  return Moonlander.LandersApp.Landers.Undeploy.Controller;
});