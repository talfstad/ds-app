define(["app",
    "assets/js/common/login/login_check_model"
  ],
  function(Landerds, LoginCheckModel) {
    Landerds.CommonLogin = {};

    Landerds.CommonLogin.Check = function(cb, args) {
      var loginCheckModel = new LoginCheckModel();

      if (Landerds.loginModel.get("logged_in")) {
        return cb(args);
      } else {
        loginCheckModel.fetch({
          success: function(userObject) {

            if (userObject.get("logged_in")) {
              Landerds.loginModel.set(userObject.attributes);
              Landerds.intercom.boot();
              cb(args);
            } else {
              Landerds.execute("show:login");
            }
          }
        });
      }
    };

    Landerds.CommonLogin.CheckAndReturnModel = function(cb, args) {
      var loginCheckModel = new LoginCheckModel();

      loginCheckModel.fetch({
        success: function(data) {
          cb(data);
        }
      });
    }

    return Landerds.CommonLogin;
  });
