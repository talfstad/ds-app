define(["app", "assets/js/apps/user/login/login_controller.js"], function(Moonlander, LoginController){
  Moonlander.module("UserApp", function(UserApp, Moonlander, Backbone, Marionette, $, _){
    UserApp.startWithParent = false;
  });

  Moonlander.module("Routers.UserApp", function(UserApp, Moonlander, Backbone, Marionette, $, _){
    UserApp.Router = Marionette.AppRouter.extend({
      appRoutes: {
        "login": "showLogin",
        "logout": "logout"
      }
    });

    var executeControllerAction = function(action, arg){
      Moonlander.startSubApp("UserApp");
      action(arg);
    };

    var userAppAPI = {
      showLogin: function(){
        Moonlander.navigate("login");
        executeControllerAction(LoginController.showLogin);
      },

      logout: function(){
      
      }
    };

    Moonlander.commands.setHandler("show:login", function(){
      userAppAPI.showLogin();
    });

    Moonlander.addInitializer(function(){
      new UserApp.Router({
        controller: userAppAPI
      });
    });
  });

  return Moonlander.UserApp;
});
