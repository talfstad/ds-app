define(["app",
    "assets/js/apps/landerds/groups/dao/deployed_lander_model"
  ],
  function(Landerds, DeployedLanderModel) {

    var DeployedLanderCollection = Backbone.Collection.extend({
      model: DeployedLanderModel,
      comparator: function(doc) {
        var str = doc.get('name') || '';
        return str.toLowerCase();
      }
    });


    return DeployedLanderCollection;
  });
