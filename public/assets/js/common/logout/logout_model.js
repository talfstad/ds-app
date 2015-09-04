define(["app"], function(Moonlander){
  var LogoutModel = Backbone.Model.extend({
    urlRoot: "/api/logout",

    defaults: {
      logged_in: false
    }
  });
  return LogoutModel;
});