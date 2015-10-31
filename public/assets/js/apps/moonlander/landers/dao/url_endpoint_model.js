define(["app",
		"/assets/js/apps/moonlander/landers/right_sidebar/jssnippets/dao/js_snippet_collection.js"], 
function(Moonlander, ActiveSnippetCollection){
  var UrlEndpointModel = Backbone.Model.extend({

    initialize: function(){
	  //build active SNIPPETS collection

      var activeSnippetsAttributes = this.get("activeSnippets");
      var activeSnippetsCollection = new ActiveSnippetCollection(activeSnippetsAttributes);
      this.set("activeSnippets", activeSnippetsCollection);

    },

  	defaults: {

    }
     
  });

  return UrlEndpointModel;

});