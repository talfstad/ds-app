define(["app", "assets/js/apps/user/login/login_view",
    "assets/js/apps/user/login/login_layout",
    "assets/js/apps/user/login/reset_password_view",
    "assets/js/apps/user/login/models/reset_password_model",
    "assets/js/common/logout/common_logout",
    "assets/js/apps/landerds/entry_point/entry_app",
    "syphon"
  ],
  function(Landerds, LoginView, LoginLayout, ResetPasswordView, ResetPasswordModel, Logout) {
    Landerds.module("UserApp.Login", function(Login, Landerds, Backbone, Marionette, $, _) {

      Login.Controller = {

        showLayout: function() {
          Landerds.loginLayout = new LoginLayout();
          Landerds.loginLayout.render();
          Landerds.rootRegion.show(Landerds.loginLayout);
        },

        showLogin: function() {
          var me = this;
          //hide the modal region
          $("#modal-region").hide();
          $(".modal-backdrop").remove();

          Landerds.UserApp.Login.Controller.showLayout();
          var loginView = new LoginView.showLogin({
            model: Landerds.loginModel
          });
          Landerds.loginLayout.content.show(loginView);

          loginView.on("login:form:submit", function() {
            var successLoginCallback = function(model, message, other) {
              model.set("alertLoading", false);

              if (model.get("logged_in")) {

                //call domains:list from here mate!
                Landerds.trigger("start:landerds");
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

            if (this.model.isValid(true)) {

              this.model.set("alertLoading", true);

              this.model.save({}, {
                success: successLoginCallback,
                error: errorLoginCallback
              });
            }
          });
        },


        logout: function() {
          //fetch logout and on success redirect to login
          Logout(function(login) {
            if (!login.get("logged_in")) {
              Landerds.execute("show:login");
            } else {
              //error
            }
          })
        },

        showResetPassword: function() {
          Landerds.UserApp.Login.Controller.showLayout();
          var resetPasswordModel = new ResetPasswordModel.ResetPasswordModel();

          var resetPasswordView = new ResetPasswordView.showForgotPassword({
            model: resetPasswordModel
          });
          Landerds.loginLayout.content.show(resetPasswordView);


          resetPasswordView.on("reset:form:submit", function() {
            var successResetCallback = function(model, message, other) {
              resetPasswordView.showCheckEmailMessage(model.attributes);
              Landerds.execute("show:login");
            };
            var errorResetCallback = function(model, message, other) {
              //something happened on submit that is out of our control
              //TODO: growl here or something to let the user know
            };

            var loginFormData = Backbone.Syphon.serialize(this);
            this.model.set(loginFormData);

            if (this.model.isValid(true)) {
              this.model.save({}, {
                success: successResetCallback,
                error: errorResetCallback
              });
            }
          });
        },

        showResetPasswordStep2: function(code) {
          Landerds.UserApp.Login.Controller.showLayout();

          var codeValid = function() {
            var resetPasswordModel = new ResetPasswordModel.ResetPasswordModelStep2({
              code: code
            });

            var resetPasswordViewStep2 = new ResetPasswordView.showForgotPasswordStep2({
              model: resetPasswordModel
            });
            Landerds.loginLayout.content.show(resetPasswordViewStep2);

            resetPasswordViewStep2.on("reset:form:submit", function() {

              var successResetCallback = function(model, message, other) {
                resetPasswordViewStep2.showSuccessfulReset();
                Landerds.execute("show:login");
              };

              var loginFormData = Backbone.Syphon.serialize(this);
              this.model.set(loginFormData);

              if (this.model.isValid(true)) {
                this.model.save({}, {
                  success: successResetCallback
                });
              }
            });
          };

          var codeInvalid = function() {
            Landerds.trigger("show:resetPassword");
          }

          var checkCodeModel = new ResetPasswordModel.Check();

          //validate code
          checkCodeModel.save({
            code: code
          }, {
            success: function(data) {
              if (data.attributes.isValid) {
                codeValid();
              } else {
                codeInvalid();
              }
            }
          });

        }

      }
    });

    return Landerds.UserApp.Login.Controller;
  });
