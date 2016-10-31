define(["app",
  "assets/js/apps/landerds/common/logout/logout_model"
], function(Landerds, LogoutModel) {

  Landerds.logout = function(cb) {
    var logoutModel = new LogoutModel();

    logoutModel.fetch({
      success: function(data) {
        Landerds.intercom.shutdown();
        cb(data);
      },
      error: function(one, two, three) {
        Landerds.execute("show:login");
      }
    });
  };
  return Landerds.logout;
});
