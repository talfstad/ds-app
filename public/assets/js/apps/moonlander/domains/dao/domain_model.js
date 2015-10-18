define(["app",
        "/assets/js/apps/jobs/jobs_gui_base_model.js"], 
function(Moonlander, JobsGuiBaseModel){
  var DomainModel = JobsGuiBaseModel.extend({
  	urlRoot: '/api/domains',
    defaults: {
      domain: "",
      nameservers: ""
    },

    initialize: function() {
      this.startActiveJobs();
    }
    
  });

  return DomainModel;

});