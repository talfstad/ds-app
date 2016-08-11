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
          "domains/show/:id": "showDomainsAndExpandDomain",
          "landers": "showLanders",
          "landers/show/:id": "showLandersAndExpandLander",
          "campaigns": "showCampaigns",
          "campaigns/show/:id": "showCampaignsAndExpandCampaign",
          "*notFound": "showLanders",
        }
      });

      var loadCommonStuff = function(callback) {
        //landerds layout here
        EntryController.loadAnchorLayout();

        //load the header here
        Landerds.trigger("header:list", function() {
          callback(false);
        });
      }

      var landerdsRoutes = {
        showDomains: function() {
          loadCommonStuff(function() {
            Landerds.trigger("domains:list");
          });
        },
        showDomainsAndExpandDomain: function(domain_id) {
          loadCommonStuff(function() {
            Landerds.trigger("domains:list", domain_id);
          });
        },
        showCampaignsAndExpandCampaign: function(campaign_id) {
          loadCommonStuff(function() {
            Landerds.trigger("campaigns:list", campaign_id);
          });
        },
        showLanders: function() {
          loadCommonStuff(function() {
            Landerds.trigger("landers:list");
          });
        },
        showLandersAndExpandLander: function(lander_id) {
          loadCommonStuff(function() {
            Landerds.trigger("landers:list", lander_id);
          });
        },
        showCampaigns: function() {
          loadCommonStuff(function() {
            Landerds.trigger("campaigns:list");
          });
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
