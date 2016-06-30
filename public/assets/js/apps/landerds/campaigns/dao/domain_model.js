define(["app"],
  function(Landerds) {
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