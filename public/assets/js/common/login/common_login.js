define(["app",
  "/assets/js/common/login/login_check_model.js"], 
function(Moonlander, LoginCheckModel){
  Moonlander.CommonLogin = {};

  Moonlander.CommonLogin.Check = function(cb, args){
    var loginCheckModel = new LoginCheckModel();

    if(Moonlander.loginModel.get("logged_in") /*|| Moonlander.loginModel.get("currently_checking")*/) {
      return cb(args);
    } else {
      // Moonlander.loginModel.set("currently_checking", true);
      loginCheckModel.fetch({
        success: function(userObject){
          // Moonlander.loginModel.set("currently_checking", false);
          if(userObject.get("logged_in")) {
            Moonlander.loginModel.set(userObject.attributes);
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