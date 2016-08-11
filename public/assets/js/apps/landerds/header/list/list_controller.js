define(["app",
    "assets/js/apps/landerds/header/list/list_view"
  ],
  function(Landerds, ListView) {
    Landerds.module("HeaderApp.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.Controller = {
        listHeader: function(callback) {

          var header = new ListView.Header({
            model: Landerds.loginModel
          });

          header.on("showDomains", function(childView, model, child) {
            Landerds.trigger("domains:list");
          });

          header.on("showLanders", function(childView, model, child) {
            Landerds.trigger("landers:list");
          });

          header.on("showCampaigns", function(childView, model, child) {
            Landerds.trigger("campaigns:list");
          });

          Landerds.rootRegion.currentView.headerRegion.show(header);

          if (callback) {
            callback(false); //ensures header is showing before calling back
          }
        },

        setActiveItem: function(item) {
          //close all sidebars
          Landerds.trigger("domains:closesidebar");
          Landerds.trigger("landers:closesidebar");
          Landerds.trigger("campaigns:closesidebar");

          if (Landerds.rootRegion.currentView.headerRegion.hasView()) {
            var headerView = Landerds.rootRegion.currentView.headerRegion.currentView;
            headerView.setActiveItem(item);
          }
        }
      };
    });

    return Landerds.HeaderApp.List.Controller;
  });
