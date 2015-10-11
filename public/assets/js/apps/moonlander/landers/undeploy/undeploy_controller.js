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
      }

    }
  });

  return Moonlander.LandersApp.Landers.Undeploy.Controller;
});