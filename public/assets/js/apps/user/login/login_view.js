define(["app",
        "tpl!/assets/js/apps/user/login/templates/login_view.tpl"],
function(Moonlander, loginViewTpl){
  Moonlander.module("UserApp.Login", function(Login, Moonlander, Backbone, Marionette, $, _){
    
    Login.showLogin = Marionette.ItemView.extend({
      template: loginViewTpl,
    });
  });

  return Moonlander.UserApp.Login;
});


