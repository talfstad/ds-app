define(["app",
    "/assets/js/apps/moonlander/domains/dao/domain_model.js",
    "/assets/js/apps/moonlander/domains/dao/active_campaign_collection.js",
    "/assets/js/apps/moonlander/domains/dao/url_endpoint_collection.js"
  ],
  function(Moonlander, DomainModel, ActiveCampaignCollection, UrlEndpointCollection) {
    var DomainCollection = Backbone.Collection.extend({
      url: '/api/domains',
      model: DomainModel,
      comparator: function(doc) {
        var str = doc.get('domain') || '';
        return str.toLowerCase();
      },
    });


    var API = {
      getDomainsCollection: function() {
        var me = this;
        var defer = $.Deferred();


        this.domainCollectionInstance = new DomainCollection();

        this.domainCollectionInstance.fetch({
          success: function(domains) {
            defer.resolve(domains);
          },
          error: function(one, two, three) {
            Moonlander.execute("show:login");
          }
        });

        var promise = defer.promise();
        return promise;
      }
    };

    Moonlander.reqres.setHandler("domains:domainsCollection", function() {
      return API.getDomainsCollection();
    });

    return DomainCollection;
  });
