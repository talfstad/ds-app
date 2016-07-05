define(["app", "assets/js/apps/user/login/login_view",
    "assets/js/apps/user/login/login_layout",
    "assets/js/common/logout/common_logout",
    "assets/js/apps/landerds/entry_point/entry_app",
    "syphon"
  ],
  function(Landerds, LoginView, LoginLayout, Logout) {
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
        }

      }
    });

    return Landerds.UserApp.Login.Controller;
  });
