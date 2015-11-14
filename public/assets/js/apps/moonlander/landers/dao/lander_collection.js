define(["app",
      "/assets/js/apps/moonlander/landers/dao/lander_model.js",
      "/assets/js/apps/moonlander/landers/dao/deployed_location_collection.js",
      "/assets/js/apps/moonlander/landers/dao/active_campaign_collection.js",
      "/assets/js/apps/moonlander/landers/dao/url_endpoint_collection.js"
    ],
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

          if (!this.landerCollectionInstance) {

            this.landerCollectionInstance = new LanderCollection();

            this.landerCollectionInstance.fetch({
                success: function(landers) {

                  landers.each(function(landerModel) {
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

                      var activeCampaignsCollection = new ActiveCampaignCollection();
                      landerModel.set("activeCampaigns", activeCampaignsCollection);

                      // when adding models to the active campaign collection, make sure that each
                      // campaigns current domains is in deployedLocations. if not then trigger a deploy on
                      // 
                      var deployedLocations = landerModel.get("deployedLocations");
                      activeCampaignsCollection.on("add", function(model, campaignCollection, options) {
                          // check all deployed locations make sure all campaign model deployed domains is deployed if not then trigger
                          // a deploy here TODO
                          $.each(model.get("currentDomains"), function(idx, currentDomain) {
                            
                            var isDeployed = false;

                              deployedLocations.each(function(location) {

                                if (currentDomain.domain_id === location.id) {
                                  isDeployed = true;
                                }
                              });

                              //if currentDomain is deployed do nothing, if not trigger a deploy on it
                              if(!isDeployed){
                                //trigger deploy
                                var attr = {
                                  lander_id: landerModel.get("id"),
                                  id: currentDomain.domain_id,
                                  lander_model: landerModel,
                                  domain: currentDomain.domain
                                }
                                Moonlander.trigger("landers:deployLanderToNewDomain", attr);
                              }
                            });
                          }, this);

                        activeCampaignsCollection.add(activeCampaignAttributes);

                      });

                    defer.resolve(landers);
                  }
                });
            } else {
              //async hack to still return defer
              setTimeout(function() {
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
