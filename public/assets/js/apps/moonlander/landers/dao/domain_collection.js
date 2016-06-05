define(["app",
    "assets/js/apps/moonlander/landers/dao/domain_model"
  ],
  function(Moonlander, DomainModel) {
    var DomainCollection = Backbone.Collection.extend({
      url: '/api/domains',
      model: DomainModel,
      comparator: 'domain',

      filterOutDomains: function(domainsToFilterOutCollection) {

        var items = new DomainCollection();

        this.each(function(domain) {
          domainId = domain.get("id");

          if (!domainsToFilterOutCollection.find(function(m) {
              var id = m.get('domain_id') || m.get('id')
              return id == domainId
            })) {

            var activeJobs = domain.get("activeJobs");
            var isDeleting = false;

            activeJobs.each(function(activeJob) {
              if (activeJob.get("action") == "deleteDomain") {
                isDeleting = true;
              }
            });

            if (!isDeleting) {
              items.add(domain);
            }

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

        // if (!this.domainCollectionInstance) {

        this.domainCollectionInstance = new DomainCollection();

        this.domainCollectionInstance.fetch({
          success: function(domains) {
            defer.resolve(domains);
          },
          error: function(one, two, three) {
            Moonlander.execute("show:login");
          }
        });
        // } else {
        //   //async hack to still return defer
        //   setTimeout(function() {
        //     defer.resolve(me.domainCollectionInstance);
        //   }, 100);
        // }

        var promise = defer.promise();
        return promise;
      }
    };

    Moonlander.reqres.setHandler("landers:domainsCollection", function() {
      return API.getDomainsCollection();
    });

    return DomainCollection;
  });
