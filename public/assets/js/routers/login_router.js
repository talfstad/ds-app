/*
  All not logged in routes go through this router
*/

define(["app"],
  function(Moonlander){

  Moonlander.module("Routers", function(Routers, Moonlander, Backbone, Marionette, $, _){
    
    var loginController = {
      login: function(args){
        
      }
    };

    Routers.LoginRouter = Marionette.AppRouter.extend({
      controller: loginController,
      appRoutes: {
        "login": "login"
      }
    });
  });

  return Moonlander.Routers.LoginRouter;
});