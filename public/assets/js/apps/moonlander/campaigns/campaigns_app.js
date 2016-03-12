define(["app", "/assets/js/apps/moonlander/campaigns/list/list_controller.js",
    "/assets/js/common/login/common_login.js",
    "/assets/js/apps/moonlander/campaigns/right_sidebar/sidebar_controller.js",
    "/assets/js/apps/moonlander/campaigns/add_new_campaign/add_new_campaign_controller.js",
    "/assets/js/apps/moonlander/campaigns/add_new_lander/add_new_lander_controller.js",
    "/assets/js/apps/moonlander/campaigns/add_new_domain/add_new_domain_controller.js",
    "assets/js/apps/moonlander/campaigns/remove_lander/remove_lander_controller.js",
    "assets/js/apps/moonlander/campaigns/remove_domain/remove_domain_controller.js"
  ],
  function(Moonlander, ListController, CommonLogin, SidemenuController, AddNewCampaignController,
    AddNewLanderController, AddNewDomainController, RemoveLanderController, RemoveDomainController) {
    Moonlander.module("CampaignsApp", function(CampaignsApp, Moonlander, Backbone, Marionette, $, _) {

      var campaignsAppAPI = {
        showCampaigns: function(d) {
          Moonlander.campaigns = {};

          Moonlander.navigate("campaigns");
          CommonLogin.Check(function() {
            ListController.showCampaigns();
            Moonlander.trigger("header:active", "campaigns");
          });
        },

        showAddNewCampaignModal: function(model) {
          AddNewCampaignController.showAddNewCampaignModal(model);
        },

        addCampaign: function(model) {
          ListController.addCampaign(model);
        },

        showAddNewLander: function(model) {
          AddNewLanderController.showAddNewLander(model);
        },

        deployLanderToCampaignDomains: function(attr) {
          ListController.deployLanderToCampaignDomains(attr);
        },

        showAddNewDomain: function(model) {
          AddNewDomainController.showAddNewDomain(model);
        },

        deployCampaignLandersToDomain: function(attr) {
          ListController.deployCampaignLandersToDomain(attr);
        },

        openSidebar: function(model) {
          SidemenuController.openSidebar(model);
        },

        closeSidebar: function() {
          SidemenuController.closeSidebar();
        },

        showRemoveLander: function(model) {
          RemoveLanderController.showRemoveLander(model);
        },

        showRemoveDomain: function(model) {
          RemoveDomainController.showRemoveDomain(model);
        },
        
        loadCampaignsSideMenu: function(d) {
          SidemenuController.loadCampaignsSideMenu();
        },

        updateTopbarTotals: function() {
          ListController.updateTopbarTotals();
        },

      };

      Moonlander.on("campaigns:list", function() {
        campaignsAppAPI.showCampaigns();
        campaignsAppAPI.loadCampaignsSideMenu();
      });

      Moonlander.on("campaigns:opensidebar", function(model) {
        campaignsAppAPI.openSidebar(model);
      });

      Moonlander.on("campaigns:closesidebar", function() {
        campaignsAppAPI.closeSidebar();
      });

      Moonlander.on("campaigns:showAddNewCampaignModal", function(model) {
        campaignsAppAPI.showAddNewCampaignModal(model);
      });

      Moonlander.on("campaigns:list:addCampaign", function(model) {
        campaignsAppAPI.addCampaign(model);
      });

      Moonlander.on("campaigns:showAddNewLander", function(attr) {
        campaignsAppAPI.showAddNewLander(attr);
      });

      Moonlander.on("campaigns:deployLanderToCampaignDomains", function(attr) {
        campaignsAppAPI.deployLanderToCampaignDomains(attr);
      });

      Moonlander.on("campaigns:showAddNewDomain", function(model) {
        campaignsAppAPI.showAddNewDomain(model);
      });

      Moonlander.on("campaigns:deployCampaignLandersToDomain", function(attr) {
        campaignsAppAPI.deployCampaignLandersToDomain(attr);
      });

      Moonlander.on("campaigns:showRemoveLander", function(model) {
        campaignsAppAPI.showRemoveLander(model);
      });

      Moonlander.on("campaigns:showRemoveDomain", function(model) {
        campaignsAppAPI.showRemoveDomain(model);
      });


      Moonlander.on("campaigns:updateTopbarTotals", function(landerModel) {
        campaignsAppAPI.updateTopbarTotals();
      });

    });

    return Moonlander.CampaignsApp;
  });
