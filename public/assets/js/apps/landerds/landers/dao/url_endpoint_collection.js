define(["app",
    "assets/js/apps/landerds/landers/dao/url_endpoint_model",
    "assets/js/apps/landerds/landers/dao/url_endpoint_collection"
  ],
  function(Landerds, UrlEndpointModel, UrlEndPointCollection) {

    var UrlEndPointCollection = Backbone.Collection.extend({
      model: UrlEndpointModel,

      filterWithActiveSnippets: function() {

        var items = new UrlEndPointCollection();

        this.each(function(urlEndpoint) {
          if (urlEndpoint.get("activeSnippets").length > 0) {
            items.add(urlEndpoint);
          }
        });

        return items;
      },

      filterForCurrentPreviewId: function(id) {

        var itemsWithActiveSnippts = this.filterWithActiveSnippets();

        var items = new UrlEndPointCollection();

        itemsWithActiveSnippts.each(function(urlEndpoint) {
          if (urlEndpoint.id == id) {
            items.add(urlEndpoint);
          }
        });

        return items;


      }

    });


    return UrlEndPointCollection;
  });
