define(["app"],
  function(Moonlander) {
    var JsSnippetModel = Backbone.Model.extend({
      
      urlRoot: "/api/js_snippets",

      defaults: {
       

      },

    });
    return JsSnippetModel;
  });
