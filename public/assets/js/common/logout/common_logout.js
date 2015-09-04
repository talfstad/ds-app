define(["app",
  "/assets/js/common/logout/logout_model.js"], function(Moonlander, LogoutModel){

  Moonlander.logout = function(cb){
    var logoutModel = new LogoutModel();

    logoutModel.fetch({
      success: function(data){
      	cb(data);
      }
    });
  };
  return Moonlander.logout;
});