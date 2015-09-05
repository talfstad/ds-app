define(["app",
  "/assets/js/common/login/login_check_model.js"], function(Moonlander, LoginCheckModel){
  Moonlander.CommonLogin = {};

  Moonlander.CommonLogin.Check = function(cb, args){
    var loginCheckModel = new LoginCheckModel();

    if(Moonlander.loginModel.get("logged_in")) {
      loginCheckModel.set({logged_in: true});
      return cb(args);
    } else {
      loginCheckModel.fetch({
        success: function(data){
          if(data.get("logged_in")) {
            cb(args);
          } else {
            Moonlander.execute("show:login");
          }
        }
      });
    }    
  };

  Moonlander.CommonLogin.CheckAndReturnModel = function(cb, args){
    var loginCheckModel = new LoginCheckModel();

    loginCheckModel.fetch({
      success: function(data){
        cb(data);
      }
    });      
  }

  return Moonlander.CommonLogin;
});