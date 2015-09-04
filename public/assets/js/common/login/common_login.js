define(["app",
  "/assets/js/common/login/login_check_model.js"], function(Moonlander, LoginCheckModel){
  Moonlander.isLoggedIn = {};

  Moonlander.checkLoggedIn = function(cb){
    var loginCheckModel = new LoginCheckModel();

    loginCheckModel.fetch({
      success: function(data){
      	cb(data);
      }
    });
  };
  return Moonlander.checkLoggedIn;
});