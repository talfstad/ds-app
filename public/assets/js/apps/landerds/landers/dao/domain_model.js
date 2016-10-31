define(["app",
        "assets/js/apps/landerds/jobs/jobs_base_gui_model"], 
function(Landerds, JobsGuiBaseModel){
  var DomainModel = JobsGuiBaseModel.extend({
  	urlRoot: '/api/domains',
    defaults: {
      domain: "",
      nameservers: "",

      //gui attributes
      //should default true since deployed_domains is where this model is used
      deploy_status: 'deployed'
    }

   
    
  });

  return DomainModel;

});