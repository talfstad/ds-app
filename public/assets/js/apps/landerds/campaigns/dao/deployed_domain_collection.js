define(["app",
    "assets/js/apps/landerds/campaigns/dao/deployed_domain_model"
  ],
  function(Landerds, DeployedDomainModel) {

    var DeployedDomainCollection = Backbone.Collection.extend({
      model: DeployedDomainModel,
      comparator: function(doc) {
        var str = doc.get('domain') || '';
        return str.toLowerCase();
      }
    });


    return DeployedDomainCollection;
  });