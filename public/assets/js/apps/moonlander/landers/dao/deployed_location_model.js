define(["app",
        "/assets/js/jobs/jobs_base_gui_model.js"], 
function(Moonlander, JobsGuiBaseModel){
  var DeployedLocationModel = JobsGuiBaseModel.extend({

    initialize: function(){
      //call base class init
      JobsGuiBaseModel.prototype.initialize.apply(this);
    },

  	defaults: {
      domain: "",
      nameservers: "",

      //gui attributes
      //should default true since deployed_domains is where this model is used
      deploy_status: 'deployed'
    },

    showProcessingState: function() {
      this.set("deploy_status", "deploying");
    },

    showFinishedState: function(jobThatFinished) {
      this.set("deploy_status", "deployed");

    },

    showErrorState: function() {
      this.set("deploy_status", "error");
    }  
    
  });

  return DeployedLocationModel;

});