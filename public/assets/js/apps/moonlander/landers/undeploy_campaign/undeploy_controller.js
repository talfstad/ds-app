define(["app",
        "/assets/js/apps/moonlander/landers/undeploy_campaign/views/undeploy_layout_view.js"], 
function(Moonlander, UndeployLayoutView, JobModel){
  Moonlander.module("LandersApp.Landers.List.Campaign.Undeploy", function(Undeploy, Moonlander, Backbone, Marionette, $, _){

    Undeploy.Controller = {
      
      showRemoveLanderFromCampaignDialog: function(model){
        
        var undeployCampaignLayout = new UndeployLayoutView({
          model: model
        });
        undeployCampaignLayout.render();
       
        Moonlander.rootRegion.currentView.modalRegion.show(undeployCampaignLayout);


        undeployCampaignLayout.on("removeCampaignFromLander", function(model){

          //delete the active campaign. need to set id = to the active_campaign_id because
          //we have the id stored as the original campaign id to make sure the filtering is correct
          //in add campaign to lander logic.

          model.set("id", model.get("active_campaign_id"));

          model.destroy({
            success: function(model, response) {
  
              //on success remove the active campaign from the collection it belongs to
              Moonlander.trigger("landers:removeCampaignFromLander", model);
   
              //this triggers a remove on the collection which we can make cause an undeploy of the landers
              //belonging to that collection
            
   

            }
          });

        });
        
      }

    }
  });

  return Moonlander.LandersApp.Landers.List.Campaign.Undeploy.Controller;
});