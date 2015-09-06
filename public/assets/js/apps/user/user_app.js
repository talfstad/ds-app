define(["app", "/assets/js/apps/user/login/login_controller.js",
  "/assets/js/common/login/common_login.js",
  "/assets/js/apps/user/login/models/login_model.js"], 
function(Moonlander, LoginController, CommonLogin, LoginModel){

  Moonlander.module("UserApp", function(UserApp, Moonlander, Backbone, Marionette, $, _){
    UserApp.Router = Marionette.AppRouter.extend({
      appRoutes: {
        "login/reset": "showResetPassword",
        "login/reset/:code": "showResetPasswordStep2",
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

      showResetPasswordStep2: function(code){
        Moonlander.navigate("login/reset/new");
        showIfNotLoggedIn(LoginController.showResetPasswordStep2, code);
      },

      logout: function(){
        Moonlander.navigate("logout");
        LoginController.logout();
      }
    };

    Moonlander.commands.setHandler("show:login", function(){
      userAppAPI.showLogin();
    });
    
    Moonlander.commands.setHandler("show:resetPassword", function(){
      userAppAPI.showResetPassword();
    });

    Moonlander.addInitializer(function(){
      Moonlander.loginModel = new LoginModel();
      new UserApp.Router({
        controller: userAppAPI
      });
    });
  });

  return Moonlander.UserApp;
});
