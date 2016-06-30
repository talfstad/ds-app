define(["app",
    "assets/js/apps/landerds/entry_point/entry_controller",
    "assets/js/apps/landerds/header/header_app",
    "assets/js/apps/landerds/domains/domains_app",
    "assets/js/apps/landerds/landers/landers_app",
    "assets/js/apps/landerds/campaigns/campaigns_app"
  ],
  function(Landerds, EntryController) {

    Landerds.module("EntryApp", function(EntryApp, Landerds, Backbone, Marionette, $, _) {

      Landerds.Router = Marionette.AppRouter.extend({
        appRoutes: {
          "domains": "showDomains",
          "landers": "showLanders",
          "campaigns": "showCampaigns",
          "*notFound": "showLanders",
        }
      });

      var loadCommonStuff = function() {
        //landerds layout here
        EntryController.loadAnchorLayout();

        //load the header here
        Landerds.trigger("header:list");
        //load the left nav here
        // Landerds.trigger("left_nav:list");
      }

      var landerdsRoutes = {
        showDomains: function() {
          loadCommonStuff();
          Landerds.trigger("domains:list");
        },
        showLanders: function() {
          loadCommonStuff();
          Landerds.trigger("landers:list");
        },
        showCampaigns: function() {
          loadCommonStuff();
          Landerds.trigger("campaigns:list");
        }
      };

      Landerds.on("start:landerds", function() {
        Landerds.intercom.boot();
        landerdsRoutes.showLanders();
      });

      Landerds.addInitializer(function() {
        new Landerds.Router({
          controller: landerdsRoutes
        });
      });
    });

    return Landerds.EntryApp;
  });
