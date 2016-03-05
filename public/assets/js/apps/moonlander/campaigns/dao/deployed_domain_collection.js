define(["app",
    "/assets/js/apps/moonlander/campaigns/dao/deployed_domain_model.js"
  ],
  function(Moonlander, DeployedDomainModel) {

    var DeployedDomainCollection = Backbone.Collection.extend({
      model: DeployedDomainModel,
      comparator: function(doc) {
        var str = doc.get('domain') || '';
        return str.toLowerCase();
      }
    });


    return DeployedDomainCollection;
  });