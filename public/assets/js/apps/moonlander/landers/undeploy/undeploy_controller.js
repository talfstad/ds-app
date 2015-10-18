define(["app",
        "/assets/js/apps/moonlander/landers/undeploy/views/undeploy_layout_view.js"], 
function(Moonlander, UndeployLayoutView){
  Moonlander.module("LandersApp.Landers.Undeploy", function(Undeploy, Moonlander, Backbone, Marionette, $, _){

    Undeploy.Controller = {
      
      showUndeployLander: function(model){
        
        var undeployLanderLayout = new UndeployLayoutView({
          model: model
        });
        undeployLanderLayout.render();
       
        Moonlander.rootRegion.currentView.modalRegion.show(undeployLanderLayout);


        undeployLanderLayout.on("undeployLanderFromDomain", function(){

          var jobAttributes = {
            action: "undeployLanderFromDomain",
            lander_id: this.model.get("lander_id"),
            domain_id: this.model.get("id"),
          }

          Moonlander.trigger("job:start", this.model, jobAttributes);    

        });
        
      }

    }
  });

  return Moonlander.LandersApp.Landers.Undeploy.Controller;
});