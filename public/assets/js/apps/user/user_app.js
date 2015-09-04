define(["app", "/assets/js/apps/user/login/login_controller.js",
  "/assets/js/common/login/common_login.js"], function(Moonlander, LoginController, LoginCheck){
  Moonlander.module("UserApp", function(UserApp, Moonlander, Backbone, Marionette, $, _){
    UserApp.startWithParent = false;
  });

  Moonlander.module("Routers.UserApp", function(UserApp, Moonlander, Backbone, Marionette, $, _){
    UserApp.Router = Marionette.AppRouter.extend({
      appRoutes: {
        "login/reset": "showResetPassword",
        "login": "showLogin",
        "logout": "logout"
      }
    });

    var executeControllerAction = function(action, arg){
      LoginCheck(function(login){
        if(login.get("logged_in")){
          //logged in
          Moonlander.trigger("start:moonlander");
        } else{
          //not logged in
          Moonlander.startSubApp("UserApp");
          action(arg);
        }
      });
    };

    var userAppAPI = {
      showLogin: function(d){
        Moonlander.navigate("login");
        executeControllerAction(LoginController.showLogin);
      },

      showResetPassword: function(){
        Moonlander.navigate("login/reset");
        executeControllerAction(LoginController.showResetPassword);
      },

      logout: function(){
        Moonlander.navigate("logout");
        LoginController.logout();
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
