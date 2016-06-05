define(["app",
  "assets/js/common/logout/logout_model"
], function(Moonlander, LogoutModel) {

  Moonlander.logout = function(cb) {
    var logoutModel = new LogoutModel();

    logoutModel.fetch({
      success: function(data) {
        Moonlander.intercom.shutdown();
        cb(data);
      },
      error: function(one, two, three) {
        Moonlander.execute("show:login");
      }
    });
  };
  return Moonlander.logout;
});
