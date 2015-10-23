define(["app",
        "/assets/js/jobs/jobs_gui_base_model.js"], 
function(Moonlander, JobsGuiBaseModel){
  var DomainModel = JobsGuiBaseModel.extend({
  	urlRoot: '/api/domains',
    defaults: {
      domain: "",
      nameservers: "",

      //gui attributes
      //should default true since deployed_domains is where this model is used
      deploy_status: 'deployed'
    },

    initialize: function() {
      this.startActiveJobs();
    },

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

  return DomainModel;

});