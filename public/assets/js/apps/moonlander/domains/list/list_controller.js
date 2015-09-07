define(["app",
        "/assets/js/apps/moonlander/domains/list/list_view.js"], 
function(Moonlander, ListView){
  Moonlander.module("DomainsApp.List", function(List, Moonlander, Backbone, Marionette, $, _){

    List.Controller = {

      showDomains: function(){

        var listView = new ListView();
        Moonlander.rootRegion.currentView.mainContentRegion.show(listView);

      }
    }
  });

  return Moonlander.DomainsApp.List.Controller;
});