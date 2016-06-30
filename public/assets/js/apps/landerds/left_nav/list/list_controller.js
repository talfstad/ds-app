define(["app", 
        "/assets/js/apps/landerds/left_nav/list/list_view.js",
        "/assets/js/apps/landerds/domains/domains_app.js",
        "/assets/js/apps/landerds/landers/landers_app.js",
        "/assets/js/apps/landerds/entry_point/entry_app.js"], 
function(Landerds, LeftNavView){
  Landerds.module("LeftNavApp", function(LeftNavApp, Landerds, Backbone, Marionette, $, _){
    LeftNavApp.Controller = {
      
      showLeftNav: function(){
        
        Landerds.leftNavView = new LeftNavView();

        
        Landerds.leftNavView.on("showDomains", function(childView, model, child) {
          Landerds.trigger("domains:list");
        });

        Landerds.leftNavView.on("showLanders", function(childView, model, child) {
          Landerds.trigger("landers:list");
        });

        Landerds.rootRegion.currentView.leftNavRegion.show(Landerds.leftNavView);

        
        //set active item
        if(Landerds.leftNavView) {
          Landerds.leftNavView.setActiveItem(Backbone.history.getFragment());
        }

      },

      setActiveItem: function(item){
        if(Landerds.leftNavView) {
          Landerds.leftNavView.setActiveItem(item);
        }
      }
    };
 
  });

  return Landerds.LeftNavApp.Controller;
});