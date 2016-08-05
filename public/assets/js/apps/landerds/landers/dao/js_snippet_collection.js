define(["app",
    "assets/js/apps/landerds/landers/dao/js_snippet_model",
  ],
  function(Landerds, JsSnippetModel) {
    var JsSnippetCollection = Backbone.Collection.extend({
      url: '/api/js_snippets',
      model: JsSnippetModel,
      comparator: function(doc) {
        var str = doc.get('name') || '';
        return str.toLowerCase();
      },
    });


    var API = {
      getJsSnippetCollection: function() {
        var me = this;
        var defer = $.Deferred();

        this.jsSnippetCollectionInstance = new JsSnippetCollection();

        this.jsSnippetCollectionInstance.fetch({
          success: function(landers) {
            defer.resolve(landers);
          },
          error: function(one, two, three) {
            Landerds.execute("show:login");
          }
        });

        var promise = defer.promise();
        return promise;
      }
    };

    Landerds.reqres.setHandler("landers:jsSnippetCollection", function() {
      return API.getJsSnippetCollection();
    });

    return JsSnippetCollection;
  });
