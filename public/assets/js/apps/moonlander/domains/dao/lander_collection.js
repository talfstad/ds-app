define(["app",
    "/assets/js/apps/moonlander/domains/dao/lander_model.js",
    "/assets/js/apps/moonlander/domains/dao/active_campaign_collection.js",
    "/assets/js/apps/moonlander/domains/dao/url_endpoint_collection.js"
  ],
  function(Moonlander, LanderModel, ActiveCampaignCollection, UrlEndpointCollection) {
    var LanderCollection = Backbone.Collection.extend({
      url: '/api/landers',
      model: LanderModel,
      comparator: function(doc) {
        var str = doc.get('name') || '';
        return str.toLowerCase();
      },
    });


    var API = {
      getLandersCollection: function() {
        var me = this;
        var defer = $.Deferred();


        this.landerCollectionInstance = new LanderCollection();

        this.landerCollectionInstance.fetch({
          success: function(landers) {
            defer.resolve(landers);
          }
        });


        var promise = defer.promise();
        return promise;
      }
    };

    Moonlander.reqres.setHandler("domains:landersCollection", function() {
      return API.getLandersCollection();
    });

    return LanderCollection;
  });
