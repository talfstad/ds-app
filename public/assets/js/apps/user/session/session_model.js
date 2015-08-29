define(["app"], function(Moonlander){
  var SessionModel = Backbone.Model.extend({
    urlRoot: "/user/auth",

    defaults: {
      user: "",
      pass: "",
      logged_in: false
    }

  });
  return SessionModel;
});