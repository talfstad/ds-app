define(["app"], function(Moonlander){
var JsSnippetsModel = Backbone.Model.extend({

  defaults: {
    id: null,
    page: "",
    name: "",
  }
    
  });
  return JsSnippetsModel;
});