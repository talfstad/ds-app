define(["app"], function(Moonlander){
var LanderModel = Backbone.Model.extend({
  urlRoot: "/api/lander",

  defaults: {
    name: "",
    optimizations: {}
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
  return LanderModel;
});