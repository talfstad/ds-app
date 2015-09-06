define(["app", 
        "/assets/js/apps/moonlander/header/list/list_controller.js"], 
function(Moonlander, ListController){
  Moonlander.module("HeaderApp", function(Header, Moonlander, Backbone, Marionette, $, _){

    var headerAPI = {
      listHeader: function(){
        ListController.listHeader();
      }
    };

    Moonlander.on("header:list", function(){
      headerAPI.listHeader();
    });
  });

  return Moonlander.HeaderApp;
});
