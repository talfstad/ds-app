define(["app",
        "/assets/js/jobs/active_jobs_collection.js"], 
function(Moonlander, ActiveJobCollection){
var JobsBaseGuiModel = Backbone.Model.extend({

    initialize: function(){
      //build active jobs child collection
      var activeJobsAttributes = this.get("activeJobs");
      var activeJobCollection = new ActiveJobCollection(activeJobsAttributes);
    
      this.set("activeJobs", activeJobCollection);

        this.listenTo(this, "destroy", function(){
         alert("hi");
        });

      //start active jobs
      this.startActiveJobs();
    },


    //checking for active jobs
    startActiveJobs: function(){
      var me = this;
      var activeJobs = this.get("activeJobs");
      activeJobs.each(function(job){
        Moonlander.trigger("job:start", job);
      });
    }
    
  });
  return JobsBaseGuiModel;
});