define(["app", "/assets/js/apps/moonlander/domains/list/list_controller.js",
    "/assets/js/common/login/common_login.js",
    "/assets/js/apps/moonlander/domains/right_sidebar/sidebar_controller.js",
    "/assets/js/apps/moonlander/domains/add_new_domain/add_new_domain_controller.js",
    "/assets/js/apps/moonlander/domains/delete_domain/delete_domain_controller.js"
  ],
  function(Moonlander, ListController, CommonLogin, SidemenuController, AddNewDomainController, DeleteDomainController) {
    Moonlander.module("DomainsApp", function(DomainsApp, Moonlander, Backbone, Marionette, $, _) {

      var landersAppAPI = {
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
        showAndReFilterActiveSnippetsView: function(model) {
          SidemenuController.showAndReFilterActiveSnippetsView(model);
        },
        updateAllActiveSnippetNames: function(model) {
          ListController.updateAllActiveSnippetNames(model);
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
        landersAppAPI.showDomains();
        landersAppAPI.loadDomainsSideMenu();
      });

      Moonlander.on("domains:opensidebar", function(model) {
        landersAppAPI.openSidebar(model);
      });

      Moonlander.on("domains:closesidebar", function() {
        landersAppAPI.closeSidebar();
      });

      Moonlander.on("domains:showAddNewDomainModal", function(model) {
        landersAppAPI.showAddNewDomainModal(model);
      });

      Moonlander.on("domains:showDeleteDomainModal", function(model) {
        landersAppAPI.showDeleteDomainModal(model);
      });

      Moonlander.on("domains:list:addDomain", function(domainModel) {
        landersAppAPI.addDomain(domainModel);
      });

      Moonlander.on("domains:list:deleteDomain", function(domainModel) {
        landersAppAPI.deleteDomain(domainModel);
      });


      ////above functions are certain they belong, below aren't sure yet


      Moonlander.on("domains:deployLanderToNewDomain", function(attr) {
        landersAppAPI.deployLanderToNewDomain(attr);
      });

      Moonlander.on("domains:removeCampaignFromLander", function(campaignModel) {
        landersAppAPI.removeCampaignFromLander(campaignModel);
      });



      Moonlander.on("domains:addCampaignToLander", function(attr) {
        landersAppAPI.addCampaignToLander(attr);
      });

      Moonlander.on("domains:showDeployToDomain", function(model) {
        landersAppAPI.showDeployToDomain(model);
      });

      Moonlander.on("domains:showAddToCampaign", function(model) {
        landersAppAPI.showAddToCampaign(model);
      });

      Moonlander.on("domains:updateTopbarTotals", function(landerModel) {
        landersAppAPI.updateTopbarTotals();
      });

    });

    return Moonlander.DomainsApp;
  });
