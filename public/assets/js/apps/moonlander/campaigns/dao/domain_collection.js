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

          if (!domainsToFilterOutCollection.get(domainId)) {
            items.add(domain);
          }
        });

        return items;
      }

    });

    var domainCollectionInstance = null;

    var API = {
      getDomainsCollection: function() {
        var me = this;
        var defer = $.Deferred();

        if (!this.domainCollectionInstance) {

          this.domainCollectionInstance = new DomainCollection();

          this.domainCollectionInstance.fetch({
            success: function(domains) {
              defer.resolve(domains);
            },
            error: function(one, two, three) {
              Moonlander.execute("show:login");
            }
          });
        } else {
          //async hack to still return defer
          setTimeout(function() {
            defer.resolve(me.domainCollectionInstance);
          }, 100);
        }

        var promise = defer.promise();
        return promise;
      }
    };

    Moonlander.reqres.setHandler("campaigns:domainsCollection", function() {
      return API.getDomainsCollection();
    });

    return DomainCollection;
  });
