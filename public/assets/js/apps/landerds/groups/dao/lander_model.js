define(["app"],
  function(Landerds) {
    var LanderModel = Backbone.Model.extend({
      urlRoot: '/api/landers',
      defaults: {
        name: "",
        //gui update attributes
        deploy_status: 'deployed',
      }
    });

    return LanderModel;

  });
