define(["app",
    "/assets/js/apps/moonlander/domains/dao/lander_model.js"
  ],
  function(Moonlander, LanderModel) {
    var LanderCollection = Backbone.Collection.extend({
      url: '/api/landers',
      model: LanderModel,

      filterOutLanders: function(landersToFilterOutCollection) {

        var items = new LanderCollection();

        this.each(function(lander) {
          landerId = lander.get("id");

          if (!landersToFilterOutCollection.find(function(m) {
              var id = m.get('lander_id') || m.get('id')
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


        landerCollectionInstance = new LanderCollection();

        landerCollectionInstance.fetch({
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

    return LanderCollection;
  });
