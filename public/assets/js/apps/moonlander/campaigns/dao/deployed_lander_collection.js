define(["app",
    "/assets/js/apps/moonlander/campaigns/dao/deployed_lander_model.js"
  ],
  function(Moonlander, DeployedLanderModel) {

    var DeployedLanderCollection = Backbone.Collection.extend({
      model: DeployedLanderModel,
      comparator: function(doc) {
        var str = doc.get('name') || '';
        return str.toLowerCase();
      }
    });


    return DeployedLanderCollection;
  });
