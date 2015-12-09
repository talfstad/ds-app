define(["app",
		"/assets/js/apps/moonlander/landers/right_sidebar/js_snippets/dao/js_snippet_model.js"], 
function(Moonlander, JsSnippetsModel) {
  var JsSnippetsCollection = Backbone.Collection.extend({
    model: JsSnippetsModel
    
  });

  return JsSnippetsCollection;
});
