define(["app",
		"/assets/js/apps/moonlander/landers/dao/lander_model.js",
    "/assets/js/apps/moonlander/landers/dao/deployed_location_collection.js",
    "/assets/js/apps/moonlander/landers/dao/url_endpoint_collection.js"], 
function(Moonlander, LanderModel, DeployedLocationsCollection, UrlEndpointCollection) {
  var LanderCollection = Backbone.Collection.extend({
    url: '/api/landers',
    model: LanderModel,
    comparator: 'name',
    collectionTotals: {
      totalNotDeployed: 0,
      totalDeploying: 0,
      totalLanders: 0
    }

  });

  var API = {
    getLandersCollection: function() {
      var me = this;

      var landersCollection = new LanderCollection();
      var defer = $.Deferred();
      landersCollection.fetch({
        success: function(landers) {

          landersCollection.each(function(landerModel){
            //1. build deployedLocations collection
            var deployedLocationsAttributes = landerModel.get("deployedLocations");
            var deployedLocationsCollection = new DeployedLocationsCollection(deployedLocationsAttributes);
            landerModel.set("deployedLocations", deployedLocationsCollection);

            //2. build urlendpoint collection
            var urlEndpointAttributes = landerModel.get("urlEndpoints");
            var urlEndpointCollection = new UrlEndpointCollection(urlEndpointAttributes);
            landerModel.set("urlEndpoints", urlEndpointCollection);
          });
          
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
