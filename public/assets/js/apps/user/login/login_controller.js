define(["app", "/assets/js/apps/user/login/login_view.js",
    "/assets/js/apps/user/login/login_layout.js",
    "/assets/js/apps/user/login/reset_password_view.js",
    "/assets/js/apps/user/login/models/reset_password_model.js",
    "/assets/js/common/logout/common_logout.js",
    "syphon"], 
function(Moonlander, LoginView, LoginLayout, ResetPasswordView, ResetPasswordModel, Logout){
  Moonlander.module("UserApp.Login", function(Login, Moonlander, Backbone, Marionette, $, _){

    Login.Controller = {

      showLayout: function(){
        Moonlander.loginLayout = new LoginLayout();
        Moonlander.loginLayout.render();
        Moonlander.rootRegion.show(Moonlander.loginLayout);
      },
      
      showLogin: function(){
        var loginView = new LoginView.showLogin({model: Moonlander.loginModel});
        Moonlander.loginLayout.content.show(loginView);
        
        loginView.on("login:form:submit", function(){
          var successLoginCallback = function(model, message, other) {
            if(model.get("logged_in")) {
              // TODO: Moonlander.login.fetch() <- this calls out to get whether or not we're logged in from the server!!!
              // need to implement it on domains:list which needs to be started
              
              //call domains:list from here mate!
              Moonlander.trigger("domains:list");
            } else {
              //show invalid login error
              loginView.showInvalidUserPassError();
            }
          };
          var errorLoginCallback = function(model, message, other) {
            //something happened on submit that is out of our control
            //TODO: growl here or something to let the user know
          };

          var loginFormData = Backbone.Syphon.serialize(this);
          this.model.set(loginFormData);
                
          if(this.model.isValid(true)) {
            this.model.save({}, {success: successLoginCallback, error: errorLoginCallback});
          }
        });
      },

      showResetPassword: function(){
        Moonlander.resetPasswordModel = new ResetPasswordModel();

        var resetPasswordView = new ResetPasswordView.showForgotPassword({model: Moonlander.resetPasswordModel});
        Moonlander.loginLayout.content.show(resetPasswordView);


        resetPasswordView.on("reset:form:submit", function(){
          var successResetCallback = function(model, message, other) {
            resetPasswordView.showInvalidUserPassError();
          };
          var errorResetCallback = function(model, message, other) {
            //something happened on submit that is out of our control
            //TODO: growl here or something to let the user know
          };

          var loginFormData = Backbone.Syphon.serialize(this);
          this.model.set(loginFormData);
                
          if(this.model.isValid(true)) {
            this.model.save({}, {success: successLoginCallback, error: errorLoginCallback});
          }
        });
      },

      logout: function(){
        //fetch logout and on success redirect to login
        Logout(function(login){
          if(!login.get("logged_in")){
            Moonlander.execute("show:login");
          } else {
            //error
          }
        })
      }

    }
  });

  return Moonlander.UserApp.Login.Controller;
});