define(["app", 
        "/assets/js/apps/moonlander/left_nav/list/list_view.js",
        "/assets/js/apps/moonlander/domains/domains_app.js",
        "/assets/js/apps/moonlander/landers/landers_app.js",
        "/assets/js/apps/moonlander/entry_point/entry_app.js"], 
function(Moonlander, LeftNavView){
  Moonlander.module("LeftNavApp", function(LeftNavApp, Moonlander, Backbone, Marionette, $, _){
    LeftNavApp.Controller = {
      
      showLeftNav: function(){
        
        Moonlander.leftNavView = new LeftNavView();

        
        Moonlander.leftNavView.on("showDomains", function(childView, model, child) {
          Moonlander.trigger("domains:list");
        });

        Moonlander.leftNavView.on("showLanders", function(childView, model, child) {
          Moonlander.trigger("landers:list");
        });

        Moonlander.rootRegion.currentView.leftNavRegion.show(Moonlander.leftNavView);      
      },

      setActiveItem: function(item){
        if(Moonlander.leftNavView) {
          Moonlander.leftNavView.setActiveItem(item);
        }
      }
    };
 
  });

  return Moonlander.LeftNavApp.Controller;
});