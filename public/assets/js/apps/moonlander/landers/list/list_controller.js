define(["app",
        "/assets/js/apps/moonlander/landers/list/list_view.js"], 
function(Moonlander, ListView){
  Moonlander.module("LandersApp.List", function(List, Moonlander, Backbone, Marionette, $, _){

    List.Controller = {

      showLanders: function(){

        var listView = new ListView();
        Moonlander.rootRegion.currentView.mainContentRegion.show(listView);

      }
    }
  });

  return Moonlander.LandersApp.List.Controller;
});