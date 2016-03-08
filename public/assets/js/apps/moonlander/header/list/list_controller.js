define(["app", "/assets/js/apps/moonlander/header/list/list_view.js"], function(Moonlander, ListView) {
  Moonlander.module("HeaderApp.List", function(List, Moonlander, Backbone, Marionette, $, _) {
    List.Controller = {
      listHeader: function() {

        var header = new ListView.Header({
          model: Moonlander.loginModel
        });

        header.on("showDomains", function(childView, model, child) {
          Moonlander.trigger("domains:list");
        });

        header.on("showLanders", function(childView, model, child) {
          Moonlander.trigger("landers:list");
        });

        header.on("showCampaigns", function(childView, model, child) {
          Moonlander.trigger("campaigns:list");
        });

        Moonlander.rootRegion.currentView.headerRegion.show(header);

        //set active item
        Moonlander.trigger("header:active", Backbone.history.getFragment());

      },

      setActiveItem: function(item) {
        //close all sidebars
        Moonlander.trigger("domains:closesidebar");
        Moonlander.trigger("landers:closesidebar");
        Moonlander.trigger("campaigns:closesidebar");

        if (Moonlander.rootRegion.currentView.headerRegion.hasView()) {
          var headerView = Moonlander.rootRegion.currentView.headerRegion.currentView;
          headerView.setActiveItem(item);
        }
      }
    };
  });

  return Moonlander.HeaderApp.List.Controller;
});
