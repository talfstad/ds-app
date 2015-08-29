define(["app"], function(Moonlander){
  Moonlander.module("UserApp", function(UserApp, Moonlander, Backbone, Marionette, $, _){
    UserApp.startWithParent = false;
  });

  Moonlander.module("Routers.UserApp", function(UserApp, Moonlander, Backbone, Marionette, $, _){
    UserApp.Router = Marionette.AppRouter.extend({
      appRoutes: {
        "login": "login",
        "logout": "logout"
      }
    });

    var executeControllerAction = function(action, arg){
      Moonlander.startSubApp("UserApp");
      action(arg);
    };

    var userAppAPI = {
      login: function(criterion){
      
      },

      logout: function(criterion){
      
      }
    };

    Moonlander.on("user:show:login", function(callback){
      Moonlander.navigate("login");
      UserAppAPI.login();
    });

    Moonlander.on("user:logout", function(callback){
      checkAuth(API.logout);
    });

    Moonlander.addInitializer(function(){
      new UserApp.Router({
        controller: userAppAPI
      });
    });
  });

  return Moonlander.UserApp;
});
