define(["app",
    "/assets/js/apps/moonlander/campaigns/dao/domain_model.js"
  ],
  function(Moonlander, DomainModel) {
    var DomainCollection = Backbone.Collection.extend({
      url: '/api/domains',
      model: DomainModel,
      comparator: 'domain',

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
            Moonlander.execute("show:login");
          }
        });


        var promise = defer.promise();
        return promise;
      }
    };

    Moonlander.reqres.setHandler("campaigns:domainsCollection", function() {
      return API.getDomainsCollection();
    });

    return DomainCollection;
  });
