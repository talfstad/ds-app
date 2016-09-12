define(["app",
    "assets/js/apps/landerds/domains/dao/domain_model",
    "assets/js/apps/landerds/domains/dao/active_campaign_collection",
    "assets/js/apps/landerds/domains/dao/url_endpoint_collection"
  ],
  function(Landerds, DomainModel, ActiveCampaignCollection, UrlEndpointCollection) {
    var DomainCollection = Backbone.Collection.extend({
      url: '/api/domains',
      model: DomainModel,
      comparator: function(doc) {
        var str = doc.get('domain') || '';
        return str.toLowerCase();
      },

      filterOutDomains: function(domainsToFilterOutCollection) {

        var items = new DomainCollection();

        this.each(function(domain) {
          domainId = domain.get("domain_id") || domain.get("id");

          if (!domainsToFilterOutCollection.find(function(m) {
              var id = m.get('domain_id') || m.get('id')
              return id == domainId
            })) {
            items.add(domain);
          }
        });

        return items;
      }
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
            Landerds.execute("show:login");
          }
        });

        var promise = defer.promise();
        return promise;
      }
    };

    Landerds.reqres.setHandler("domains:domainsCollection", function() {
      return API.getDomainsCollection();
    });

    return DomainCollection;
  });
