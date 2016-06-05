define(["app",
    "assets/js/apps/moonlander/landers/right_sidebar/js_snippets/dao/active_js_snippet_model"
  ],
  function(Moonlander, JsSnippetsModel) {
    var JsSnippetsCollection = Backbone.Collection.extend({
      model: JsSnippetsModel,
      comparator: function(doc) {
        var str = doc.get('name') || '';
        return str.toLowerCase();
      }

    });

    return JsSnippetsCollection;
  });