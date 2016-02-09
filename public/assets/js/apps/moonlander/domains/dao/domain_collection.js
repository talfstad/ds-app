define(["app",
    "/assets/js/apps/moonlander/domains/dao/domain_model.js",
    "/assets/js/apps/moonlander/domains/dao/active_campaign_collection.js",
    "/assets/js/apps/moonlander/domains/dao/url_endpoint_collection.js"
  ],
  function(Moonlander, LanderModel, ActiveCampaignCollection, UrlEndpointCollection) {
    var DomainCollection = Backbone.Collection.extend({
      url: '/api/domains',
      model: LanderModel,
      comparator: function(doc) {
        var str = doc.get('domain') || '';
        return str.toLowerCase();
      },
    });


    var API = {
      getLandersCollection: function() {
        var me = this;
        var defer = $.Deferred();


        this.landerCollectionInstance = new DomainCollection();

        this.landerCollectionInstance.fetch({
          success: function(landers) {
            defer.resolve(landers);
          },
          error: function(one, two, three) {
            Moonlander.execute("show:login");
          }
        });


        var promise = defer.promise();
        return promise;
      }
    };

    Moonlander.reqres.setHandler("domains:landersCollection", function() {
      return API.getLandersCollection();
    });

    return DomainCollection;
  });
