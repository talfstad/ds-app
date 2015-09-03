define(["app"], function(Moonlander){
var ResetPasswordModel = Backbone.Model.extend({
  urlRoot: "/api/login/reset",

  defaults: {
    email: ""
  },
  validation: {
      email: {
        required: true,
        msg: "is Required"
      }
    }
  });
  return ResetPasswordModel;
});