define(["app",
    "assets/js/apps/landerds/landers/dao/lander_model",
    "assets/js/apps/landerds/landers/dao/active_campaign_collection",
    "assets/js/apps/landerds/landers/dao/url_endpoint_collection"
  ],
  function(Landerds, LanderModel, ActiveCampaignCollection, UrlEndpointCollection) {
    var LanderCollection = Backbone.Collection.extend({
      url: '/api/landers',
      model: LanderModel,
      comparator: function(doc) {
        var str = doc.get('name') || '';
        return str.toLowerCase();
      },
      filterOutLanders: function(landersToFilterOutCollection) {

        var items = new LanderCollection();

        this.each(function(lander) {
          landerId = lander.get("id");

          if (!landersToFilterOutCollection.find(function(m) {
              var id = m.get("lander_id");
              if (!id) id = m.get("id");

              return id == landerId
            })) {
            items.add(lander);
          }

        });

        return items;
      }
    });

    var API = {
      getLandersCollection: function() {
        var me = this;
        var defer = $.Deferred();

        this.landerCollectionInstance = new LanderCollection();

        this.landerCollectionInstance.fetch({
          success: function(landers) {
            defer.resolve(landers);
          },
          error: function(one, two, three) {
            Landerds.execute("show:login");
          }
        });


        var promise = defer.promise();
        return promise;
      }
    };

    Landerds.reqres.setHandler("landers:landersCollection", function() {
      return API.getLandersCollection();
    });

    return LanderCollection;
  });
