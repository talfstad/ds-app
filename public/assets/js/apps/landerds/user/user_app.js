define(["app", "assets/js/apps/landerds/user/login/login_controller",
    "assets/js/apps/landerds/common/login/common_login",
    "assets/js/apps/landerds/user/login/models/login_model",
    "assets/js/apps/landerds/user/settings/settings_controller"
  ],
  function(Landerds, LoginController, CommonLogin, LoginModel, SettingsController) {

    Landerds.module("UserApp", function(UserApp, Landerds, Backbone, Marionette, $, _) {
      UserApp.Router = Marionette.AppRouter.extend({
        appRoutes: {
          "login": "showLogin",
          "logout": "logout",
          "login/reset": "showResetPassword",
          "login/reset/:code": "showResetPasswordStep2"
        }
      });

      var showIfNotLoggedIn = function(action, arg) {
        CommonLogin.CheckAndReturnModel(function(login) {
          if (login.get("logged_in")) {
            Landerds.trigger("start:landerds");
          } else {
            //not logged in
            action(arg);
          }
        });
      };

      var userAppAPI = {
        showLogin: function(d) {
          Landerds.navigate("login");
          showIfNotLoggedIn(LoginController.showLogin);
        },

        showResetPassword: function() {
          Landerds.navigate("login/reset");
          showIfNotLoggedIn(LoginController.showResetPassword);
        },

        showResetPasswordStep2: function(code) {
          Landerds.navigate("login/reset/new");
          showIfNotLoggedIn(LoginController.showResetPasswordStep2, code);
        },

        showSettings: function() {
          SettingsController.showSettingsModal();
        },

        logout: function(e) {
          Landerds.navigate("logout");
          LoginController.logout();
        }
      };

      Landerds.commands.setHandler("show:login", function() {
        userAppAPI.showLogin();
      });

      Landerds.on("show:resetPassword", function(attr) {
        userAppAPI.showResetPassword();
      });

      Landerds.on("user:logout", function() {
        userAppAPI.logout();
      });

      Landerds.on("user:showSettings", function() {
        userAppAPI.showSettings();
      });


      Landerds.addInitializer(function() {
        Landerds.loginModel = new LoginModel();
        new UserApp.Router({
          controller: userAppAPI
        });
      });
    });

    return Landerds.UserApp;
  });
