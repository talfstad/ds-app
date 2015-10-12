define(["app", "/assets/js/apps/user/login/login_view.js",
    "/assets/js/apps/user/login/login_layout.js",
    "/assets/js/apps/user/login/reset_password_view.js",
    "/assets/js/apps/user/login/models/reset_password_model.js",
    "/assets/js/common/logout/common_logout.js",
    "/assets/js/apps/moonlander/entry_point/entry_app.js",
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
        Moonlander.UserApp.Login.Controller.showLayout();
        var loginView = new LoginView.showLogin({model: Moonlander.loginModel});
        Moonlander.loginLayout.content.show(loginView);
        
        loginView.on("login:form:submit", function(){
          var successLoginCallback = function(model, message, other) {
            if(model.get("logged_in")) {
              
              //call domains:list from here mate!
              Moonlander.trigger("start:moonlander");
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
        Moonlander.UserApp.Login.Controller.showLayout();
        var resetPasswordModel = new ResetPasswordModel.ResetPasswordModel();

        var resetPasswordView = new ResetPasswordView.showForgotPassword({model: resetPasswordModel});
        Moonlander.loginLayout.content.show(resetPasswordView);


        resetPasswordView.on("reset:form:submit", function(){
          var successResetCallback = function(model, message, other) {
            resetPasswordView.showCheckEmailMessage(model.attributes);
          };
          var errorResetCallback = function(model, message, other) {
            //something happened on submit that is out of our control
            //TODO: growl here or something to let the user know
          };

          var loginFormData = Backbone.Syphon.serialize(this);
          this.model.set(loginFormData);
                
          if(this.model.isValid(true)) {
            this.model.save({}, {success: successResetCallback, error: errorResetCallback});
          }
        });
      },

      showResetPasswordStep2: function(code){
        Moonlander.UserApp.Login.Controller.showLayout();

        var codeValid = function(){
          var resetPasswordModel = new ResetPasswordModel.ResetPasswordModelStep2({
            code: code
          });

          var resetPasswordViewStep2 = new ResetPasswordView.showForgotPasswordStep2({model: resetPasswordModel});
          Moonlander.loginLayout.content.show(resetPasswordViewStep2);


          resetPasswordViewStep2.on("reset:form:submit", function(){
            var successResetCallback = function(model, message, other) {
              resetPasswordViewStep2.showSuccessfulReset();
            };
            var errorResetCallback = function(model, message, other) {
              //something happened on submit that is out of our control
              //TODO: growl here or something to let the user know
            };

            var loginFormData = Backbone.Syphon.serialize(this);
            this.model.set(loginFormData);
                  
            if(this.model.isValid(true)) {
              this.model.save({}, {success: successResetCallback, error: errorResetCallback});
            }
          });
        };

        var codeInvalid = function(){
          Moonlander.execute("show:resetPassword");
        }

        var checkCodeModel = new ResetPasswordModel.Check();

        //validate code
        checkCodeModel.save({code: code}, {
          success:function(data){
            if(data.attributes.isValid){
              codeValid();
            } else {
              codeInvalid();
            }
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