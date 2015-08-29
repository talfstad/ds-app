define(["app", "assets/js/apps/user/login/login_view.js"], function(Moonlander, LoginView){
  Moonlander.module("UserApp.Login", function(Login, Moonlander, Backbone, Marionette, $, _){
    Login.Controller = {
      
      showLogin: function(id){
          var loginView = new LoginView.showLogin();
          Moonlander.rootRegion.show(loginView);
      }

    }
  });

  return Moonlander.UserApp.Login.Controller;
});
