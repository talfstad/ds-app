define(["app",
  "/assets/js/common/login/login_check_model.js"], function(Moonlander, LoginCheckModel){
  Moonlander.CommonLogin = {};

  Moonlander.CommonLogin.Check = function(cb){
    var loginCheckModel = new LoginCheckModel();

    if(Moonlander.loginModel.get("logged_in")) {
      loginCheckModel.set({logged_in: true});
      return cb(loginCheckModel);
    } else {
      loginCheckModel.fetch({
        success: function(data){
          cb(data);
        }
      });
    }    
  };
  return Moonlander.CommonLogin;
});