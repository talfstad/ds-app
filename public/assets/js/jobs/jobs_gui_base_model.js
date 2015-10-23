define(["app"], 
function(Moonlander){
var JobsGuiBaseModel = Backbone.Model.extend({

    //checking for active jobs
    startActiveJobs: function(){
        var me = this;
        var activeJobs = this.get("activeJobs") || [];
        $.each(activeJobs, function(idx, jobAttributes){
            Moonlander.trigger("job:start", me, jobAttributes);
        });
    },

    //YOU SHOULD OVERRIDE THESE IN CHILD CLASSES!
    processingState: function() {
      this.set("deploy_status", "deploying");
    },

    finishedState: function() {
      this.set("deploy_status", "deployed");

    },

    errorState: function() {
      this.set("deploy_status", "error");
    }  
});
  return JobsGuiBaseModel;
});