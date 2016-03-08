define(["app", "/assets/js/apps/moonlander/campaigns/list/list_controller.js",
    "/assets/js/common/login/common_login.js",
    "/assets/js/apps/moonlander/campaigns/right_sidebar/sidebar_controller.js",
    "/assets/js/apps/moonlander/campaigns/add_new_campaign/add_new_campaign_controller.js",
    "/assets/js/apps/moonlander/campaigns/add_new_lander/add_new_lander_controller.js",
    // "/assets/js/apps/moonlander/campaigns/delete_domain/delete_domain_controller.js",
    // "/assets/js/apps/moonlander/campaigns/undeploy_lander/undeploy_controller.js",
    "/assets/js/apps/moonlander/campaigns/add_new_domain/add_new_domain_controller.js",
    // "/assets/js/apps/moonlander/campaigns/undeploy_campaign/undeploy_controller.js"
  ],
  function(Moonlander, ListController, CommonLogin, SidemenuController, AddNewCampaignController,
    AddNewLanderController, AddNewDomainController) {
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

        //////////above methods are good, below are just here still

        showDeleteDomainModal: function(model) {
          // DeleteDomainController.showDeleteDomainModal(model);
        },

        openSidebar: function(model) {
          SidemenuController.openSidebar(model);
        },
        closeSidebar: function() {
          SidemenuController.closeSidebar();
        },



        loadCampaignsSideMenu: function(d) {
          SidemenuController.loadCampaignsSideMenu();
        },

        deleteDomain: function(model) {
          ListController.deleteDomain(model);
        },


        showUndeployLander: function(model) {
          // UndeployLanderController.showUndeployLander(model);
        },


        addCampaignToDomain: function(attr) {
          ListController.addCampaignToDomain(attr);
        },

        showUndeployDomainFromCampaignDialog: function(model) {
          // UndeployCampaignController.showUndeployDomainFromCampaignDialog(model);
        },


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



      /////////above methods are good, below are just here still




      // Moonlander.on("domains:showDeleteDomainModal", function(model) {
      //   campaignsAppAPI.showDeleteDomainModal(model);
      // });


      // Moonlander.on("domains:list:deleteDomain", function(domainModel) {
      //   campaignsAppAPI.deleteDomain(domainModel);
      // });

      // Moonlander.on("domains:showDeployNewLander", function(model) {
      //   campaignsAppAPI.showDeployNewLander(model);
      // });



      // Moonlander.on("domains:showUndeployLander", function(model) {
      //   campaignsAppAPI.showUndeployLander(model);
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
