define(["app",
		"/assets/js/apps/moonlander/landers/right_sidebar/jssnippets/dao/model.js"], 
function(Moonlander, JsSnippetsModel) {
  var JsSnippetsCollection = Backbone.Collection.extend({
    model: JsSnippetsModel,
  });

  return JsSnippetsCollection;
});
