define(["app",
		"/assets/js/apps/moonlander/landers/dao/lander_model.js"], 
function(Moonlander, LanderModel) {
  var LanderCollection = Backbone.Collection.extend({
    url: '/api/landers',
    model: LanderModel,
    comparator: 'name',
    collectionTotals: {}

  });

  var API = {
    getLandersCollection: function() {
      var me = this;

      var landersCollection = new LanderCollection();
      var defer = $.Deferred();
      landersCollection.fetch({
        success: function(landers) {

          landers.collectionTotals.totalNotDeployed = 0;
          landers.collectionTotals.totalDeploying = 0;
          landers.collectionTotals.totalLanders = 0;
          
          defer.resolve(landers);
        }
      });
      var promise = defer.promise();
      return promise;
    }
  };

  Moonlander.reqres.setHandler("landers:landersCollection", function() {
    return API.getLandersCollection();
  });

  return LanderCollection;
});
