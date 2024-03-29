define(["app",
		"assets/js/apps/landerds/landers/right_sidebar/js_snippets/dao/active_js_snippet_collection"], 
function(Landerds, ActiveSnippetCollection){
  var UrlEndpointModel = Backbone.Model.extend({

    initialize: function(){

      var activeSnippetsAttributes = this.get("activeSnippets");
      var activeSnippetsCollection = new ActiveSnippetCollection(activeSnippetsAttributes);
      this.set("activeSnippets", activeSnippetsCollection);

    },

  	defaults: {
      filename: ""
    }
     
  });

  return UrlEndpointModel;

});