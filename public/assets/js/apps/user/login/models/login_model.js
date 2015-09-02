define(["app"], function(Moonlander){
var LoginModel = Backbone.Model.extend({
  urlRoot: "/api/login",

  defaults: {
    username: "",
    password: ""
  },
  validation: {
      username: {
        required: true,
        msg: "is Required"
      },
      password: {
        required: true,
        msg: "is Required"
      }
    }
  });
  return LoginModel;
});