define(["app",
        "/assets/js/jobs/active_jobs_collection.js"], 
function(Moonlander, ActiveJobCollection){
var JobsGuiBaseModel = Backbone.Model.extend({

    initialize: function(){
      //build active jobs child collection
      var activeJobsAttributes = this.get("activeJobs");
      var activeJobCollection = new ActiveJobCollection(activeJobsAttributes);
      this.set("activeJobs", activeJobCollection);

      //start active jobs
      this.startActiveJobs();
    },

    //checking for active jobs
    startActiveJobs: function(){
      var me = this;
      var activeJobs = this.get("activeJobs");
      activeJobs.each(function(job){
        Moonlander.trigger("job:start", me);
      });
    },

    //YOU SHOULD OVERRIDE THESE IN CHILD CLASSES!
    showProcessingState: function() {
      this.set("deploy_status", "deploying");
    },

    showFinishedState: function() {
      this.set("deploy_status", "deployed");

    },

    showErrorState: function() {
      this.set("deploy_status", "error");
    }  
});
  return JobsGuiBaseModel;
});