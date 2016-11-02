define(["app",
    "assets/js/apps/landerds/entry_point/entry_controller",
    "assets/js/apps/landerds/header/header_app",
    "assets/js/apps/landerds/domains/domains_app",
    "assets/js/apps/landerds/landers/landers_app",
    "assets/js/apps/landerds/groups/groups_app"
  ],
  function(Landerds, EntryController) {

    Landerds.module("EntryApp", function(EntryApp, Landerds, Backbone, Marionette, $, _) {

      Landerds.Router = Marionette.AppRouter.extend({
        appRoutes: {
          "domains": "showDomains",
          "domains/show/:id": "showDomainsAndExpandDomain",
          "landers": "showLanders",
          "landers/show/:id": "showLandersAndExpandLander",
          "groups": "showGroups",
          "groups/show/:id": "showGroupsAndExpandGroups",
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
        showGroupsAndExpandGroups: function(group_id) {
          loadCommonStuff(function() {
            Landerds.trigger("groups:list", group_id);
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
        showGroups: function() {
          loadCommonStuff(function() {
            Landerds.trigger("groups:list");
          });
        }
      };

      Landerds.on("start:landerds", function() {
        Landerds.intercom.boot(function() {
          Landerds.documentation.boot();
        });
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
