/*
  All Routes go through root router to determine whether or not a login is necessary
*/

define(["app", "/assets/js/routers/moonlander_router.js", 
        "/assets/js/routers/login_router.js",
        "/assets/js/user/session_helpers.js"],
  function(Moonlander, MoonlanderRouter, LoginRouter, SessionHelpers){

  Moonlander.module("Routers", function(Routers, Moonlander, Backbone, Marionette, $, _){
    Routers.startWithParent = false;
    
    Routers.RootRouter = Marionette.AppRouter.extend({
      appRoutes: {
        "": "domains",
        "domains": "domains",
        "campaigns": "campaigns",
        "landers": "landers"
      }
    });
    
    var RootRouterController = {
      domains: function(args){
        if(SessionHelpers.isLoggedIn()){
          //logged in, continue on your merry way

        } else{
          //send to login page
          Moonlander.trigger("login");
        }
      },
      campaigns: function(args){

      },
      landers: function(args){

      }
    };

    Moonlander.addInitializer(function(){
      new Routers.RootRouter({
        controller: RootRouterController
      });
      new LoginRouter();
    });
  });

  return Moonlander.Routers.RootRouter;
});