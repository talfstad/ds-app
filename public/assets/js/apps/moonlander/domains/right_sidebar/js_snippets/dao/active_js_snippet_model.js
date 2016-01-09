define(["app"], function(Moonlander) {
  var JsSnippetsModel = Backbone.Model.extend({

    urlRoot: "/api/active_snippets",

    defaults: {
      id: null,
      page: "",
      name: "",
    }

  });
  return JsSnippetsModel;
});
