define(["app",
		"/assets/js/apps/moonlander/landers/dao/lander_model.js",
    "backbone.paginator"], 
function(Moonlander, LanderModel) {
  var LanderCollection = Backbone.PageableCollection.extend({
    url: '/api/landers',
    model: LanderModel,
    mode: 'client',
    // state: {
    //   firstPage: 0,
    //   pageSize: 10
    // },
    comparator: 'name',
  });

  var API = {
    getLandersCollection: function() {
      var landersCollection = new LanderCollection();
      var defer = $.Deferred();
      landersCollection.fetch({
        success: function(data) {
          defer.resolve(data);
        }
      });
      var promise = defer.promise();
      return promise;
    }
  };

  Moonlander.reqres.setHandler("landers:landersCollection", function() {
    return API.getLandersCollection();
  });

  return LanderCollection;
});
