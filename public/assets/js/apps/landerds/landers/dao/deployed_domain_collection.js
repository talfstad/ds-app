define(["app",
    "assets/js/apps/landerds/landers/dao/deployed_domain_model"
  ],
  function(Landerds, deployedDomainModel) {

    var deployedDomainCollection = Backbone.Collection.extend({
      model: deployedDomainModel,
      comparator: function(doc) {
        var str = doc.get('domain') || '';
        return str.toLowerCase();
      }
    });

    return deployedDomainCollection;
  });
