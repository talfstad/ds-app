define(["app", "/assets/js/apps/moonlander/campaigns/list/list_controller.js",
    "/assets/js/common/login/common_login.js",
    "/assets/js/apps/moonlander/campaigns/right_sidebar/sidebar_controller.js",
    "/assets/js/apps/moonlander/campaigns/add_new_domain/add_new_domain_controller.js",
    "/assets/js/apps/moonlander/campaigns/deploy_new_lander/deploy_new_lander_controller.js",
    "/assets/js/apps/moonlander/campaigns/delete_domain/delete_domain_controller.js",
    "/assets/js/apps/moonlander/campaigns/undeploy_lander/undeploy_controller.js",
    "/assets/js/apps/moonlander/campaigns/add_to_campaign/add_to_campaign_controller.js",
    "/assets/js/apps/moonlander/campaigns/undeploy_campaign/undeploy_controller.js"
  ],
  function(Moonlander, ListController, CommonLogin, SidemenuController, AddNewDomainController,
    DeployNewLanderController, DeleteDomainController, UndeployLanderController, AddToCampaignController,
    UndeployCampaignController) {
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


        //////////above methods are good, below are just here still
        showAddNewDomainModal: function(model) {
          AddNewDomainController.showAddNewDomainModal(model);
        },
        showDeleteDomainModal: function(model) {
          DeleteDomainController.showDeleteDomainModal(model);
        },

        openSidebar: function(model) {
          SidemenuController.openSidebar(model);
        },
        closeSidebar: function() {
          SidemenuController.closeSidebar();
        },

        addDomain: function(domainModel) {
          ListController.addDomain(domainModel);
        },

        loadCampaignsSideMenu: function(d) {
          SidemenuController.loadCampaignsSideMenu();
        },

        deleteDomain: function(model) {
          ListController.deleteDomain(model);
        },

        showDeployNewLander: function(model) {
          DeployNewLanderController.showDeployNewLander(model);
        },

        deployNewLander: function(attr) {
          ListController.deployNewLander(attr);
        },

        showUndeployLander: function(model) {
          UndeployLanderController.showUndeployLander(model);
        },

        showAddNewCampaign: function(model) {
          AddToCampaignController.showAddNewCampaign(model);
        },

        addCampaignToDomain: function(attr) {
          ListController.addCampaignToDomain(attr);
        },

        showUndeployDomainFromCampaignDialog: function(model) {
          UndeployCampaignController.showUndeployDomainFromCampaignDialog(model);
        },


        //above functions are certain, below not sure we need yet

        updateTopbarTotals: function() {
          ListController.updateTopbarTotals();
        },

        removeCampaignFromLander: function(campaignModel) {
          ListController.removeCampaignFromLander(campaignModel);
        }


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

      /////////above methods are good, below are just here still


      // Moonlander.on("domains:showAddNewDomainModal", function(model) {
      //   campaignsAppAPI.showAddNewDomainModal(model);
      // });

      // Moonlander.on("domains:showDeleteDomainModal", function(model) {
      //   campaignsAppAPI.showDeleteDomainModal(model);
      // });

      // Moonlander.on("domains:list:addDomain", function(domainModel) {
      //   campaignsAppAPI.addDomain(domainModel);
      // });

      // Moonlander.on("domains:list:deleteDomain", function(domainModel) {
      //   campaignsAppAPI.deleteDomain(domainModel);
      // });

      // Moonlander.on("domains:showDeployNewLander", function(model) {
      //   campaignsAppAPI.showDeployNewLander(model);
      // });

      // Moonlander.on("domains:deployNewLander", function(attr) {
      //   campaignsAppAPI.deployNewLander(attr);
      // });

      // Moonlander.on("domains:showUndeployLander", function(model) {
      //   campaignsAppAPI.showUndeployLander(model);
      // });

      // Moonlander.on("domains:showAddNewCampaign", function(model) {
      //   campaignsAppAPI.showAddNewCampaign(model);
      // });

      // Moonlander.on("domains:addCampaignToDomain", function(attr) {
      //   campaignsAppAPI.addCampaignToDomain(attr);
      // });

      // Moonlander.on("domains:showUndeployDomainFromCampaignDialog", function(model) {
      //   campaignsAppAPI.showUndeployDomainFromCampaignDialog(model);
      // });

      // Moonlander.on("domains:removeCampaignFromLander", function(model) {
      //   campaignsAppAPI.removeCampaignFromLander(model);
      // });



      ////above functions are certain they belong, below aren't sure yet



      Moonlander.on("campaigns:updateTopbarTotals", function(landerModel) {
        campaignsAppAPI.updateTopbarTotals();
      });

    });

    return Moonlander.CampaignsApp;
  });
