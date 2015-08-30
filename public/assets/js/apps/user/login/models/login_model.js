define(["app"], function(Moonlander){
var LoginModel = Backbone.Model.extend({
      urlRoot: "/login",

      defaults: {
        username: "",
        password: ""
      },

      validate: function(attrs, options) {
        var errors = {}
        if (! attrs.username) {
          errors.user = "can't be blank";
        }
        if (! attrs.password) {
          errors.user = "can't be blank";
        }
        if( ! _.isEmpty(errors)){
          return errors;
        }
      }
    });
    return LoginModel;
});