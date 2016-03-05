define(["app"],
  function(Moonlander) {
    var DomainModel = Backbone.Model.extend({
      urlRoot: '/api/domains',
      defaults: {
        domain: "",
        //gui update attributes
        deploy_status: 'deployed',
      }
    });

    return DomainModel;

  });