define(["app",
    "assets/js/apps/moonlander/landers/dao/url_endpoint_model",
    "assets/js/apps/moonlander/landers/dao/url_endpoint_collection"
  ],
  function(Moonlander, UrlEndpointModel, UrlEndPointCollection) {

    var UrlEndPointCollection = Backbone.Collection.extend({
      model: UrlEndpointModel,

      filterWithActiveSnippets: function() {

      	var items = new UrlEndPointCollection();

      	this.each(function(urlEndpoint){
      		if(urlEndpoint.get("activeSnippets").length > 0) {
      			items.add(urlEndpoint);
      		}
      	});

      	return items;
      }

    });


    return UrlEndPointCollection;
  });
