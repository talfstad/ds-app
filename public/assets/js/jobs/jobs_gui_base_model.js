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
        if(activeJobs.length > 0) {
          this.processingState();
        }
    },

    //YOU SHOULD OVERRIDE THESE IN CHILD CLASSES!
    processingState: function() {
      this.set("deployed_status", "deploying");
    },

    finishedState: function() {
      this.set("deployed_status", "deployed");

    },

    errorState: function() {
      this.set("deployed_status", "error");
    }  
});
  return JobsGuiBaseModel;
});