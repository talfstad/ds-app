define(["app",
    "/assets/js/apps/moonlander/landers/dao/lander_model.js",
    "/assets/js/apps/moonlander/landers/dao/active_campaign_collection.js",
    "/assets/js/apps/moonlander/landers/dao/url_endpoint_collection.js"
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

    // var landerCollectionInstance = null;

    var API = {
      getLandersCollection: function() {
        var me = this;
        var defer = $.Deferred();

        // if (!this.landerCollectionInstance) {

          this.landerCollectionInstance = new LanderCollection();

          this.landerCollectionInstance.fetch({
            success: function(landers) {
              defer.resolve(landers);
            }
          });
        // } else {
        //   //async hack to still return defer
        //   setTimeout(function() {
        //     defer.resolve(me.landerCollectionInstance);
        //   }, 200);
        // }

        var promise = defer.promise();
        return promise;
      }
    };

    Moonlander.reqres.setHandler("landers:landersCollection", function() {
      return API.getLandersCollection();
    });

    return LanderCollection;
  });
