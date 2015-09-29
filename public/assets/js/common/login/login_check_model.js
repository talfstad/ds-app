define(["app"], function(Moonlander){
  var LoginCheckModel = Backbone.Model.extend({
    urlRoot: "/api/login",

    defaults: {
      logged_in: false,
      currently_checking: false
    }
  });
  return LoginCheckModel;
});