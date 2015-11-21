define(["app"], function(Moonlander) {
  var AwsModel = Backbone.Model.extend({
    urlRoot: "/api/updateAccessKeys",

    initialize: function() {
    },

    defaults: {
      accessKeyId: "",
      secretAccessKey: ""
    }

  });
  return AwsModel;
});
