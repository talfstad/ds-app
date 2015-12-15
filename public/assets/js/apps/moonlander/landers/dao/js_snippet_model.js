define(["app"],
  function(Moonlander) {
    var JsSnippetModel = Backbone.Model.extend({
      
      urlRoot: "/api/js_snippets",

      defaults: {
       active: false,
       editing: false,
       changed: false,
       showEditInfo: false,
       snippetAlertMsg: "",
       hasShownCodeChangedAlert: false

      },

    });
    return JsSnippetModel;
  });
