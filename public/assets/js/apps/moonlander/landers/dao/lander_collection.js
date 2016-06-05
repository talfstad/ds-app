define(["app",
    "assets/js/apps/moonlander/landers/dao/lander_model",
    "assets/js/apps/moonlander/landers/dao/active_campaign_collection",
    "assets/js/apps/moonlander/landers/dao/url_endpoint_collection"
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
            },
            error: function(one, two, three){
              Moonlander.execute("show:login");
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
