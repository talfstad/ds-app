define(["app",
    "/assets/js/apps/moonlander/domains/dao/js_snippet_model.js",
  ],
  function(Moonlander, JsSnippetModel) {
    var JsSnippetCollection = Backbone.Collection.extend({
      url: '/api/js_snippets',
      model: JsSnippetModel,
      comparator: function(doc) {
        var str = doc.get('name') || '';
        return str.toLowerCase();
      },
    });

    var jsSnippetCollectionInstance = null;

    var API = {
      getJsSnippetCollection: function() {
        var me = this;
        var defer = $.Deferred();

        if (!this.jsSnippetCollectionInstance) {

          this.jsSnippetCollectionInstance = new JsSnippetCollection();

          this.jsSnippetCollectionInstance.fetch({
            success: function(landers) {
              defer.resolve(landers);
            }
          });
        } else {
          //async hack to still return defer
          setTimeout(function() {
            defer.resolve(me.jsSnippetCollectionInstance);
          }, 200);
        }

        var promise = defer.promise();
        return promise;
      }
    };

    Moonlander.reqres.setHandler("domains:jsSnippetCollection", function() {
      return API.getJsSnippetCollection();
    });

    return JsSnippetCollection;
  });
