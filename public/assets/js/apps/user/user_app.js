define(["app", "/assets/js/apps/user/login/login_controller.js"], function(Moonlander, LoginController){
  Moonlander.module("UserApp", function(UserApp, Moonlander, Backbone, Marionette, $, _){
    UserApp.startWithParent = false;
  });

  Moonlander.module("Routers.UserApp", function(UserApp, Moonlander, Backbone, Marionette, $, _){
    UserApp.Router = Marionette.AppRouter.extend({
      appRoutes: {
        "login": "showLogin",
        "logout": "logout",
        "login/reset": "showResetPassword"
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

      showResetPassword: function(){
        Moonlander.navigate("login/reset");
        executeControllerAction(LoginController.showResetPassword);
      },

      logout: function(){
        Moonlander.navigate("logout");
        executeControllerAction(LoginController.logout);
      }
    };

    Moonlander.commands.setHandler("show:login", function(){
      userAppAPI.showLogin();
    });

    Moonlander.addInitializer(function(){
      
      LoginController.showLayout();

      new UserApp.Router({
        controller: userAppAPI
      });
    });
  });

  return Moonlander.UserApp;
});
