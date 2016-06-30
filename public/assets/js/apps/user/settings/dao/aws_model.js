define(["app"], 
  function(Landerds) {
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
