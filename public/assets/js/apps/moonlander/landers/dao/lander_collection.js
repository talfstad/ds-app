define(["app",
		"/assets/js/apps/moonlander/landers/dao/lander_model.js",
    "backbone.paginator"], 
function(Moonlander, LanderModel) {
  var LanderCollection = Backbone.Collection.extend({
    url: '/api/landers',
    model: LanderModel,
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
