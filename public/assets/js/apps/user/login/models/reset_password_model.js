define(["app"], function(Landerds){
  var ResetPassword = {};

  ResetPassword.ResetPasswordModel = Backbone.Model.extend({
    urlRoot: "/api/login/request/reset",

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

  ResetPassword.ResetPasswordModelStep2 = Backbone.Model.extend({
    urlRoot: "/api/login/reset/password",

    defaults: {
      code: "",
      password: "",
      confirm_password: ""
    },
    validation: {
      password: {
        required: true
      },
      confirm_password: {
        equalTo: 'password'
      }
    }
  });

  ResetPassword.Check = Backbone.Model.extend({
    urlRoot: "/api/login/reset/check",

    defaults: {
      
    }
  });

  

  return ResetPassword;

});