define(["app", 
  "assets/js/apps/moonlander/entry_point/entry_controller.js",
  "assets/js/apps/user/session/session_helpers.js"], 

  function(Moonlander, EntryController, SessionHelpers){

  Moonlander.module("EntryApp", function(EntryApp, Moonlander, Backbone, Marionette, $, _){
    EntryApp.startWithParent = false;
  });

  Moonlander.module("Routers.EntryApp", function(EntryApp, Moonlander, Backbone, Marionette, $, _){
    EntryApp.Router = Marionette.AppRouter.extend({
      appRoutes: {
        "": "domains",
        "domains": "domains",
        "campaigns": "campaigns",
        "landers": "landers"
      }
    });

    var executeControllerAction = function(action, arg){
      if(SessionHelpers.isLoggedIn()){
        Moonlander.startSubApp("EntryApp");
        action(arg);
      } else{
        Moonlander.UserApp.app.execute("show:login");
      }
    };
    
    var entryAppAPI = {
      domains: function(args){
        executeControllerAction(EntryController.loadAnchorLayout);
      },

      campaigns: function(id){
        executeControllerAction(EntryController.loadAnchorLayout);
      },
      landers: function(args){
        executeControllerAction(EntryController.loadAnchorLayout);
      }
    };

    Moonlander.addInitializer(function(){
      new EntryApp.Router({
        controller: entryAppAPI
      });
    });
  });

  return Moonlander.EntryApp;
});


