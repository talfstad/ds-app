define(["app",
    "assets/js/apps/landerds/domains/list/list_controller",
    "assets/js/common/login/common_login",
    "assets/js/apps/landerds/domains/right_sidebar/sidebar_controller",
    "assets/js/apps/landerds/domains/add_new_domain/add_new_domain_controller",
    "assets/js/apps/landerds/domains/deploy_new_lander/deploy_new_lander_controller",
    "assets/js/apps/landerds/domains/delete_domain/delete_domain_controller",
    "assets/js/apps/landerds/domains/undeploy_lander/undeploy_controller",
    "assets/js/apps/landerds/domains/add_to_campaign/add_to_campaign_controller",
    "assets/js/apps/landerds/domains/undeploy_campaign/undeploy_controller"
  ],
  function(Landerds, ListController, CommonLogin, SidemenuController, AddNewDomainController,
    DeployNewLanderController, DeleteDomainController, UndeployLanderController, AddToCampaignController,
    UndeployCampaignController) {
    Landerds.module("DomainsApp", function(DomainsApp, Landerds, Backbone, Marionette, $, _) {

      var domainsAppAPI = {
        showDomains: function(id) {
          if (id) {
            Landerds.navigate("domains/show/" + id);
          } else {
            Landerds.navigate("domains");
          }

          CommonLogin.Check(function() {
            ListController.showDomains(id);
            Landerds.trigger("header:active", "domains");
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

      Landerds.on("domains:list", function(id) {
        domainsAppAPI.showDomains(id);
      });

      Landerds.on("domains:opensidebar", function(model) {
        domainsAppAPI.openSidebar(model);
      });

      Landerds.on("domains:closesidebar", function() {
        domainsAppAPI.closeSidebar();
      });

      Landerds.on("domains:showAddNewDomainModal", function(model) {
        domainsAppAPI.showAddNewDomainModal(model);
      });

      Landerds.on("domains:showDeleteDomainModal", function(model) {
        domainsAppAPI.showDeleteDomainModal(model);
      });

      Landerds.on("domains:list:addDomain", function(domainModel) {
        domainsAppAPI.addDomain(domainModel);
      });

      Landerds.on("domains:list:deleteDomain", function(domainModel) {
        domainsAppAPI.deleteDomain(domainModel);
      });

      Landerds.on("domains:showDeployNewLander", function(model) {
        domainsAppAPI.showDeployNewLander(model);
      });

      Landerds.on("domains:deployNewLander", function(attr) {
        domainsAppAPI.deployNewLander(attr);
      });

      Landerds.on("domains:showUndeployLander", function(model) {
        domainsAppAPI.showUndeployLander(model);
      });

      Landerds.on("domains:showAddNewCampaign", function(model) {
        domainsAppAPI.showAddNewCampaign(model);
      });

      Landerds.on("domains:deployCampaignLandersToDomain", function(attr) {
        domainsAppAPI.deployCampaignLandersToDomain(attr);
      });

      Landerds.on("domains:showUndeployDomainFromCampaignDialog", function(attr) {
        domainsAppAPI.showUndeployDomainFromCampaignDialog(attr);
      });

      Landerds.on("domains:removeCampaignFromDomain", function(model) {
        domainsAppAPI.removeCampaignFromDomain(model);
      });



      ////above functions are certain they belong, below aren't sure yet

      Landerds.on("domains:updateTopbarTotals", function(landerModel) {
        domainsAppAPI.updateTopbarTotals();
      });

    });

    return Landerds.DomainsApp;
  });
