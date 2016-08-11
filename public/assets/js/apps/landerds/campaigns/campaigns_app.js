define(["app", 
    "assets/js/apps/landerds/campaigns/list/list_controller",
    "assets/js/common/login/common_login",
    "assets/js/apps/landerds/campaigns/right_sidebar/sidebar_controller",
    "assets/js/apps/landerds/campaigns/add_new_campaign/add_new_campaign_controller",
    "assets/js/apps/landerds/campaigns/add_new_lander/add_new_lander_controller",
    "assets/js/apps/landerds/campaigns/add_new_domain/add_new_domain_controller",
    "assets/js/apps/landerds/campaigns/remove_lander/remove_lander_controller",
    "assets/js/apps/landerds/campaigns/remove_domain/remove_domain_controller",
    "assets/js/apps/landerds/campaigns/remove_campaign/remove_campaign_controller",
  ],
  function(Landerds, ListController, CommonLogin, SidemenuController, AddNewCampaignController,
    AddNewLanderController, AddNewDomainController, RemoveLanderController, RemoveDomainController,
    RemoveCampaignController) {
    Landerds.module("CampaignsApp", function(CampaignsApp, Landerds, Backbone, Marionette, $, _) {

      var campaignsAppAPI = {
        showCampaigns: function(id) {
          if (id) {
            Landerds.navigate("campaigns/show/" + id);
          } else {
            Landerds.navigate("campaigns");
          }

          CommonLogin.Check(function() {
            ListController.showCampaigns(id);
            Landerds.trigger("header:active", "campaigns");
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

        updateTopbarTotals: function() {
          ListController.updateTopbarTotals();
        },

        showRemoveCampaign: function(model) {
          RemoveCampaignController.showRemoveCampaign(model);
        }

      };

      Landerds.on("campaigns:list", function(id) {
        campaignsAppAPI.showCampaigns(id);
      });

      Landerds.on("campaigns:opensidebar", function(model) {
        campaignsAppAPI.openSidebar(model);
      });

      Landerds.on("campaigns:closesidebar", function() {
        campaignsAppAPI.closeSidebar();
      });

      Landerds.on("campaigns:showAddNewCampaignModal", function(model) {
        campaignsAppAPI.showAddNewCampaignModal(model);
      });

      Landerds.on("campaigns:list:addCampaign", function(model) {
        campaignsAppAPI.addCampaign(model);
      });

      Landerds.on("campaigns:showAddNewLander", function(attr) {
        campaignsAppAPI.showAddNewLander(attr);
      });

      Landerds.on("campaigns:deployLanderToCampaignDomains", function(attr) {
        campaignsAppAPI.deployLanderToCampaignDomains(attr);
      });

      Landerds.on("campaigns:showAddNewDomain", function(model) {
        campaignsAppAPI.showAddNewDomain(model);
      });

      Landerds.on("campaigns:deployCampaignLandersToDomain", function(attr) {
        campaignsAppAPI.deployCampaignLandersToDomain(attr);
      });

      Landerds.on("campaigns:showRemoveLander", function(model) {
        campaignsAppAPI.showRemoveLander(model);
      });

      Landerds.on("campaigns:showRemoveDomain", function(model) {
        campaignsAppAPI.showRemoveDomain(model);
      });

      Landerds.on("campaigns:showRemoveCampaign", function(model) {
        campaignsAppAPI.showRemoveCampaign(model);
      });


      Landerds.on("campaigns:updateTopbarTotals", function(landerModel) {
        campaignsAppAPI.updateTopbarTotals();
      });

    });

    return Landerds.CampaignsApp;
  });
