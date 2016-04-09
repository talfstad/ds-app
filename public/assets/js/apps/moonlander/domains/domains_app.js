define(["app", "/assets/js/apps/moonlander/domains/list/list_controller.js",
    "/assets/js/common/login/common_login.js",
    "/assets/js/apps/moonlander/domains/right_sidebar/sidebar_controller.js",
    "/assets/js/apps/moonlander/domains/add_new_domain/add_new_domain_controller.js",
    "/assets/js/apps/moonlander/domains/deploy_new_lander/deploy_new_lander_controller.js",
    "/assets/js/apps/moonlander/domains/delete_domain/delete_domain_controller.js",
    "/assets/js/apps/moonlander/domains/undeploy_lander/undeploy_controller.js",
    "/assets/js/apps/moonlander/domains/add_to_campaign/add_to_campaign_controller.js",
    "/assets/js/apps/moonlander/domains/undeploy_campaign/undeploy_controller.js"
  ],
  function(Moonlander, ListController, CommonLogin, SidemenuController, AddNewDomainController,
    DeployNewLanderController, DeleteDomainController, UndeployLanderController, AddToCampaignController,
    UndeployCampaignController) {
    Moonlander.module("DomainsApp", function(DomainsApp, Moonlander, Backbone, Marionette, $, _) {

      var domainsAppAPI = {
        showDomains: function(d) {
          Moonlander.domains = {};

          Moonlander.navigate("domains");
          CommonLogin.Check(function() {
            ListController.showDomains();
            Moonlander.trigger("header:active", "domains");
          });
        },
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

        loadDomainsSideMenu: function(d) {
          SidemenuController.loadDomainsSideMenu();
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

        deployCampaignLandersToDomain: function(attr) {
          ListController.deployCampaignLandersToDomain(attr);
        },

        showUndeployDomainFromCampaignDialog: function(model) {
          UndeployCampaignController.showUndeployDomainFromCampaignDialog(model);
        },

        removeCampaignFromDomain: function(campaignModel) {
          ListController.removeCampaignFromDomain(campaignModel);
        },

        //above functions are certain, below not sure we need yet

        updateTopbarTotals: function() {
          ListController.updateTopbarTotals();
        },

      };

      Moonlander.on("domains:list", function() {
        domainsAppAPI.showDomains();
        domainsAppAPI.loadDomainsSideMenu();
      });

      Moonlander.on("domains:opensidebar", function(model) {
        domainsAppAPI.openSidebar(model);
      });

      Moonlander.on("domains:closesidebar", function() {
        domainsAppAPI.closeSidebar();
      });

      Moonlander.on("domains:showAddNewDomainModal", function(model) {
        domainsAppAPI.showAddNewDomainModal(model);
      });

      Moonlander.on("domains:showDeleteDomainModal", function(model) {
        domainsAppAPI.showDeleteDomainModal(model);
      });

      Moonlander.on("domains:list:addDomain", function(domainModel) {
        domainsAppAPI.addDomain(domainModel);
      });

      Moonlander.on("domains:list:deleteDomain", function(domainModel) {
        domainsAppAPI.deleteDomain(domainModel);
      });

      Moonlander.on("domains:showDeployNewLander", function(model) {
        domainsAppAPI.showDeployNewLander(model);
      });

      Moonlander.on("domains:deployNewLander", function(attr) {
        domainsAppAPI.deployNewLander(attr);
      });

      Moonlander.on("domains:showUndeployLander", function(model) {
        domainsAppAPI.showUndeployLander(model);
      });

      Moonlander.on("domains:showAddNewCampaign", function(model) {
        domainsAppAPI.showAddNewCampaign(model);
      });

      Moonlander.on("domains:deployCampaignLandersToDomain", function(attr) {
        domainsAppAPI.deployCampaignLandersToDomain(attr);
      });

      Moonlander.on("domains:showUndeployDomainFromCampaignDialog", function(attr) {
        domainsAppAPI.showUndeployDomainFromCampaignDialog(attr);
      });

      Moonlander.on("domains:removeCampaignFromDomain", function(model) {
        domainsAppAPI.removeCampaignFromDomain(model);
      });



      ////above functions are certain they belong, below aren't sure yet

      Moonlander.on("domains:updateTopbarTotals", function(landerModel) {
        domainsAppAPI.updateTopbarTotals();
      });

    });

    return Moonlander.DomainsApp;
  });
