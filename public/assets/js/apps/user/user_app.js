define(["app", "/assets/js/apps/user/login/login_controller.js",
  "/assets/js/common/login/common_login.js",
  "/assets/js/apps/user/login/models/login_model.js"], function(Moonlander, LoginController, CommonLogin, LoginModel){

  Moonlander.module("UserApp", function(UserApp, Moonlander, Backbone, Marionette, $, _){
    UserApp.Router = Marionette.AppRouter.extend({
      appRoutes: {
        "login/reset": "showResetPassword",
        "login": "showLogin",
        "logout": "logout"
      }
    });

    var showIfNotLoggedIn = function(action, arg){
      CommonLogin.CheckAndReturnModel(function(login){
        if(login.get("logged_in")){
          Moonlander.trigger("start:moonlander");
        } else{
          //not logged in
          action(arg);
        }
      });
    };

    var userAppAPI = {
      showLogin: function(d){
        Moonlander.navigate("login");
        showIfNotLoggedIn(LoginController.showLogin);
      },

      showResetPassword: function(){
        Moonlander.navigate("login/reset");
        showIfNotLoggedIn(LoginController.showResetPassword);
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
      Moonlander.loginModel = new LoginModel();
      
      LoginController.showLayout();

      new UserApp.Router({
        controller: userAppAPI
      });
    });
  });

  return Moonlander.UserApp;
});
