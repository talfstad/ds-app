define(["app", 
  "/assets/js/apps/moonlander/entry_point/entry_controller.js",
  "/assets/js/apps/moonlander/domains/domains_app.js"], 
  function(Moonlander, EntryController){

  Moonlander.module("EntryApp", function(EntryApp, Moonlander, Backbone, Marionette, $, _){

    Moonlander.Router = Marionette.AppRouter.extend({
      appRoutes: {
        "": "showDomains",
        "domains": "showDomains"
      }
    });

    var moonlanderRoutes = {
      showDomains: function(){
        Moonlander.trigger("domains:list");
      }
    };

    Moonlander.on("start:moonlander", function(){
      moonlanderRoutes.showDomains();
    });

     Moonlander.addInitializer(function(){
      new Moonlander.Router({
        controller: moonlanderRoutes
      });
    });
  });

  return Moonlander.EntryApp;
});