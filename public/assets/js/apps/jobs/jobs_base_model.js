define(["app"], 
function(Moonlander){
var JobsBaseModel = Backbone.Model.extend({

    url: "/api/jobs",

    defaults: {
        "action": "",
        "processing": false,
        "lander_id": "",
        "campaign_id": "",
        "domain_id": ""
    }
  
    
});
  return JobsBaseModel;
});