define(["app",
		"/assets/js/apps/moonlander/landers/dao/lander_model.js",
    "backbone.paginator"], 
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
        success: function(data) {
          data.collectionTotals.totalNotDeployed = 0;
          data.collectionTotals.totalDeploying = 0;
          data.collectionTotals.totalLanders = 0;
          
          $.each(data.models, function(index, lander){
            if(lander.get("deploying")){
              data.collectionTotals.totalDeploying++;
            } else if(!lander.get("deployed") && !lander.get("deploying")) {
              data.collectionTotals.totalNotDeployed++;
            }
            data.collectionTotals.totalLanders++;
          });
          
          defer.resolve(data);
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
