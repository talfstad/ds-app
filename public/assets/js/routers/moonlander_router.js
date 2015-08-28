/*
  All logged in moonlander routes go through this router
*/

define(["app"],
  function(Moonlander){

  Moonlander.module("Routers", function(Routers, Moonlander, Backbone, Marionette, $, _){

    var moonlanderController = {
      domains: function(args){

      },
      campaigns: function(args){

      },
      landers: function(args){

      }
    };

    Routers.MoonlanderRouter = Marionette.AppRouter.extend({
      controller: moonlanderController,
      appRoutes: {
        "": "domains",
        "domains": "domains",
        "campaigns": "campaigns",
        "landers": "landers"
      }
    });

  });

  return Moonlander.Routers.MoonlanderRouter;
});