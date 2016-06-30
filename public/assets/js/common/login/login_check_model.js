define(["app"], function(Landerds){
  var LoginCheckModel = Backbone.Model.extend({
    urlRoot: "/api/login",

    defaults: {
      logged_in: false    }
  });
  return LoginCheckModel;
});