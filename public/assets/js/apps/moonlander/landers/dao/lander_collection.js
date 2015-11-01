define(["app",
		"/assets/js/apps/moonlander/landers/dao/lander_model.js",
    "/assets/js/apps/moonlander/landers/dao/deployed_location_collection.js",
    "/assets/js/apps/moonlander/landers/dao/active_campaign_collection.js",
    "/assets/js/apps/moonlander/landers/dao/url_endpoint_collection.js"], 
function(Moonlander, LanderModel, DeployedLocationsCollection, ActiveCampaignCollection, UrlEndpointCollection) {
  var LanderCollection = Backbone.Collection.extend({
    url: '/api/landers',
    model: LanderModel,
    comparator: 'name'
  });

  var landerCollectionInstance = null;

  var API = {
    getLandersCollection: function() {
      var me = this;
      var defer = $.Deferred();

      if(!this.landerCollectionInstance){

        this.landerCollectionInstance = new LanderCollection();

        this.landerCollectionInstance.fetch({
          success: function(landers) {

            landers.each(function(landerModel){
              //1. build deployedLocations collection
              //2. build urlendpoint collection
              var activeCampaignAttributes = landerModel.get("activeCampaigns");
              var urlEndpointAttributes = landerModel.get("urlEndpoints");
              var deployedLocationsAttributes = landerModel.get("deployedLocations");


              var deployedLocationsCollection = new DeployedLocationsCollection(deployedLocationsAttributes);
              //extra things it needs
              deployedLocationsCollection.urlEndpoints = urlEndpointAttributes;
              deployedLocationsCollection.landerName = landerModel.get("name");

              landerModel.set("deployedLocations", deployedLocationsCollection);

              var urlEndpointCollection = new UrlEndpointCollection(urlEndpointAttributes);
              landerModel.set("urlEndpoints", urlEndpointCollection);

              var activeCampaignsCollection = new ActiveCampaignCollection(activeCampaignAttributes);
              landerModel.set("activeCampaigns", activeCampaignsCollection);

            });
            
            defer.resolve(landers);
          }
        });
      } else {
        //async hack to still return defer
        setTimeout(function(){
          defer.resolve(me.landerCollectionInstance);
        }, 100);
      }

      var promise = defer.promise();
      return promise;
    }
  };

  Moonlander.reqres.setHandler("landers:landersCollection", function() {
    return API.getLandersCollection();
  });

  return LanderCollection;
});
