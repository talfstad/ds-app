define(["app", "/assets/js/apps/moonlander/header/list/list_view.js"], function(Moonlander, ListView){
  Moonlander.module("HeaderApp.List", function(List, Moonlander, Backbone, Marionette, $, _){
    List.Controller = {
      listHeader: function(){

          // var header = new ListView.Header({
          //   model: Moonlander.session
          // });

          // header.on("logout:clicked", function(){
          //   Moonlander.trigger("authentication:logout");
          // });

          // Moonlander.headerRegion.show(header);
      
      }
    };
  });

  return Moonlander.HeaderApp.List.Controller;
});