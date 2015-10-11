define(["app", 
  "/assets/js/apps/moonlander/entry_point/entry_controller.js",
  "/assets/js/apps/moonlander/header/header_app.js",
  // "/assets/js/apps/moonlander/left_nav/left_nav_app.js",
  "/assets/js/apps/moonlander/domains/domains_app.js",
  "/assets/js/apps/moonlander/landers/landers_app.js"], 
  function(Moonlander, EntryController){

  Moonlander.module("EntryApp", function(EntryApp, Moonlander, Backbone, Marionette, $, _){

    Moonlander.Router = Marionette.AppRouter.extend({
      appRoutes: {
        "domains": "showDomains",
        "landers": "showLanders",
        "*notFound": "showLanders",
      }
    });

    var loadCommonStuff = function(){
      //moonlander layout here
      EntryController.loadAnchorLayout();
      //load the header here
      Moonlander.trigger("header:list");
      //load the left nav here
      // Moonlander.trigger("left_nav:list");
    }

    var moonlanderRoutes = {
      showDomains: function(){
        loadCommonStuff();
        Moonlander.trigger("domains:list");
      },
      showLanders: function(){
        loadCommonStuff();
        Moonlander.trigger("landers:list");
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