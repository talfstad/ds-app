define(["app",
    "assets/js/common/login/login_check_model"
  ],
  function(Moonlander, LoginCheckModel) {
    Moonlander.CommonLogin = {};

    Moonlander.CommonLogin.Check = function(cb, args) {
      var loginCheckModel = new LoginCheckModel();

      if (Moonlander.loginModel.get("logged_in")) {
        return cb(args);
      } else {
        loginCheckModel.fetch({
          success: function(userObject) {

            if (userObject.get("logged_in")) {
              Moonlander.loginModel.set(userObject.attributes);
              Moonlander.intercom.boot();
              cb(args);
            } else {
              Moonlander.execute("show:login");
            }
          }
        });
      }
    };

    Moonlander.CommonLogin.CheckAndReturnModel = function(cb, args) {
      var loginCheckModel = new LoginCheckModel();

      loginCheckModel.fetch({
        success: function(data) {
          cb(data);
        }
      });
    }

    return Moonlander.CommonLogin;
  });
