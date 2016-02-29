define(["app", "/assets/js/apps/moonlander/domains/list/list_controller.js",
    "/assets/js/common/login/common_login.js",
    "/assets/js/apps/moonlander/domains/right_sidebar/sidebar_controller.js",
    "/assets/js/apps/moonlander/domains/add_new_domain/add_new_domain_controller.js",
    "/assets/js/apps/moonlander/domains/deploy_new_lander/deploy_new_lander_controller.js",
    "/assets/js/apps/moonlander/domains/delete_domain/delete_domain_controller.js"
  ],
  function(Moonlander, ListController, CommonLogin, SidemenuController, AddNewDomainController, 
    DeployNewLanderController, DeleteDomainController) {
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

        deployNewLander: function(attr){
          ListController.deployNewLander(attr);
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

        showDeployNewLander: function(model){
          DeployNewLanderController.showDeployNewLander(model);
        },

        //above functions are certain, below not sure we need yet

        addNewDuplicatedLander: function(model) {
          ListController.addNewDuplicatedLander(model);
        },
        redeployLanders: function(landersArray, successCallback) {
          ListController.redeployLanders(landersArray, successCallback);
        },
        removeSnippetFromAllLanders: function(attr) {
          ListController.removeSnippetFromAllLanders(attr);
        },
        deployLanderToNewDomain: function(attr) {
          ListController.deployLanderToDomain(attr);
        },
        updateTopbarTotals: function() {
          ListController.updateTopbarTotals();
        },
        addCampaignToLander: function(attr) {
          ListController.addCampaignToLander(attr);
        },

        removeCampaignFromLander: function(campaignModel) {
          ListController.removeCampaignFromLander(campaignModel);
        },
        
        updateToModifiedAndSave: function() {
          SidemenuController.updateToModifiedAndSave();
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

      Moonlander.on("domains:showDeployNewLander", function(model){
        domainsAppAPI.showDeployNewLander(model);
      });

      Moonlander.on("domains:deployNewLander", function(attr){
        domainsAppAPI.deployNewLander(attr);
      });

      ////above functions are certain they belong, below aren't sure yet


      Moonlander.on("domains:deployLanderToNewDomain", function(attr) {
        domainsAppAPI.deployLanderToNewDomain(attr);
      });

      Moonlander.on("domains:removeCampaignFromLander", function(campaignModel) {
        domainsAppAPI.removeCampaignFromLander(campaignModel);
      });



      Moonlander.on("domains:addCampaignToLander", function(attr) {
        domainsAppAPI.addCampaignToLander(attr);
      });

      Moonlander.on("domains:showDeployToDomain", function(model) {
        domainsAppAPI.showDeployToDomain(model);
      });

      Moonlander.on("domains:showAddToCampaign", function(model) {
        domainsAppAPI.showAddToCampaign(model);
      });

      Moonlander.on("domains:updateTopbarTotals", function(landerModel) {
        domainsAppAPI.updateTopbarTotals();
      });

    });

    return Moonlander.DomainsApp;
  });
