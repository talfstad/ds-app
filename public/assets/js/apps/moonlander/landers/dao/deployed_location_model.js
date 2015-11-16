define(["app",
        "/assets/js/jobs/jobs_base_gui_model.js",
        "/assets/js/apps/moonlander/landers/dao/attached_campaigns_collection.js"], 
function(Moonlander, JobsGuiBaseModel, AttachedCampaignsCollection){
  var DeployedLocationModel = JobsGuiBaseModel.extend({

    url: '/',

    initialize: function(){
      var me = this;
      //call base class init
      JobsGuiBaseModel.prototype.initialize.apply(this);

      //when job is destroyed must look to see if there are any more
      var activeJobs = this.get("activeJobs");
      activeJobs.on("finishedState", function(model){
    
        if(model.get("action") === "undeployLanderFromDomain") {
          me.trigger('destroy', me, me.collection);     
        }

      });


      //build attachedCampaigns collection
      var attachedCampaignsCollection = new AttachedCampaignsCollection();
      this.set("attachedCampaigns", attachedCampaignsCollection);

    
    },

  	defaults: {
      domain: "",
      nameservers: "",

      //gui attributes
      //should default true since deployed_domains is where this model is used
      deploy_status: 'deployed'
    }

    
  });

  return DeployedLocationModel;

});