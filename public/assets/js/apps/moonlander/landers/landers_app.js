define(["app", "/assets/js/apps/moonlander/landers/list/list_controller.js",
    "/assets/js/common/login/common_login.js",
    "/assets/js/apps/moonlander/landers/right_sidebar/sidebar_controller.js",
    "/assets/js/apps/moonlander/landers/edit/edit_controller.js",
    "/assets/js/apps/moonlander/landers/deploy_to_domain/deploy_to_domain_controller.js",
    "/assets/js/apps/moonlander/landers/add_to_campaign/add_to_campaign_controller.js",
    "/assets/js/apps/moonlander/landers/undeploy_domain/undeploy_domain_controller.js",
    "/assets/js/apps/moonlander/landers/undeploy_campaign/undeploy_campaign_controller.js",
    "/assets/js/apps/moonlander/landers/add_new_lander/add_new_lander_controller.js",
    "/assets/js/apps/moonlander/landers/delete_lander/delete_lander_controller.js",
    "/assets/js/apps/moonlander/landers/duplicate_lander/duplicate_lander_controller.js",
    "/assets/js/apps/moonlander/landers/rip_new_lander/rip_new_lander_controller.js",
    "/assets/js/apps/moonlander/landers/js_snippets/js_snippets_controller.js"
  ],
  function(Moonlander, ListController, CommonLogin, SidemenuController, EditController, DeployToDomainController,
    AddNewCampaignController, RemoveDomainController, RemoveCampaignController, AddNewLanderController, DeleteLanderController,
    DuplicateLanderController, RipNewLanderController, JsSnippetsController) {
    Moonlander.module("LandersApp", function(LandersApp, Moonlander, Backbone, Marionette, $, _) {

      var landersAppAPI = {
        showLanders: function(d) {
          Moonlander.landers = {};

          Moonlander.navigate("landers");
          CommonLogin.Check(function() {
            ListController.showLanders();
            Moonlander.trigger("header:active", "landers");
          });
        },
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
        showJsSnippetsModal: function(model) {
          JsSnippetsController.showJsSnippetsModal(model);
        },
        updateTopbarTotals: function() {
          ListController.updateTopbarTotals();
        },
        showDuplicateLanderModal: function(landerModelToDuplicateAttr) {
          DuplicateLanderController.showDuplicateLander(landerModelToDuplicateAttr);
        },
        addCampaignToLander: function(attr) {
          ListController.addCampaignToLander(attr);
        },
        showEditLander: function(model) {
          EditController.showEditLander(model);
        },
        showRipNewLanderModal: function(model) {
          RipNewLanderController.showRipNewLanderModal(model);
        },
        showDeployToDomain: function(model) {
          DeployToDomainController.showDeployLanderToDomain(model);
        },
        showAddNewCampaign: function(model) {
          AddNewCampaignController.showAddNewCampaign(model);
        },
        showAddNewLanderModal: function() {
          AddNewLanderController.showAddNewLanderModal();
        },
        showRemoveDomain: function(model) {
          RemoveDomainController.showRemoveDomain(model);
        },
        showEditJsSnippetsModal: function(landerModel, snippet_id, showDescription) {
          JsSnippetsController.showEditJsSnippetsModal(landerModel, snippet_id, showDescription);
        },
        showUndeployDomainFromCampaignDialog: function(attr) {
          RemoveCampaignController.showUndeployDomainFromCampaignDialog(attr);
        },
        removeCampaignFromLander: function(campaignModel) {
          ListController.removeCampaignFromLander(campaignModel);
        },
        loadLandersSideMenu: function(d) {
          SidemenuController.loadLandersSideMenu();
        },
        updateToModifiedAndSave: function() {
          SidemenuController.updateToModifiedAndSave();
        },
        deleteLander: function(model) {
          ListController.deleteLander(model);
        },
        showDeleteLanderModal: function(model) {
          DeleteLanderController.showDeleteLanderModal(model);
        },
        openSidebar: function(model) {
          SidemenuController.openSidebar(model);
        },
        closeSidebar: function() {
          SidemenuController.closeSidebar();
        },
        addLander: function(landerModel) {
          ListController.addLander(landerModel);
        },
        deployCampaignLandersToDomain: function(attr) {
          ListController.deployCampaignLandersToDomain(attr);
        }
      };

      Moonlander.on("landers:deployCampaignLandersToDomain", function(attr) {
        landersAppAPI.deployCampaignLandersToDomain(attr);
      });

      Moonlander.on("landers:list", function() {
        landersAppAPI.showLanders();
        landersAppAPI.loadLandersSideMenu();
      });

      Moonlander.on("landers:opensidebar", function(model) {
        landersAppAPI.openSidebar(model);
      });

      Moonlander.on("landers:closesidebar", function() {
        landersAppAPI.closeSidebar();
      });

      Moonlander.on("landers:updateToModifiedAndSave", function() {
        landersAppAPI.updateToModifiedAndSave();
      });

      Moonlander.on("landers:showEdit", function(model) {
        landersAppAPI.showEditLander(model);
      });

      Moonlander.on("landers:showRemoveDomain", function(model) {
        landersAppAPI.showRemoveDomain(model);
      });

      Moonlander.on("landers:list:deleteLander", function(model) {
        landersAppAPI.deleteLander(model);
      });

      Moonlander.on("landers:sidebar:showSidebarActiveSnippetsView", function(model) {
        landersAppAPI.showAndReFilterActiveSnippetsView(model);
      });

      Moonlander.on("landers:showDeleteLanderModal", function(model) {
        landersAppAPI.showDeleteLanderModal(model);
      });

      Moonlander.on("landers:showUndeployDomainFromCampaignDialog", function(attr) {
        landersAppAPI.showUndeployDomainFromCampaignDialog(attr);
      });

      Moonlander.on("landers:list:addNewDuplicatedLander", function(model) {
        landersAppAPI.addNewDuplicatedLander(model);
      });

      Moonlander.on("landers:deployLanderToNewDomain", function(attr) {
        landersAppAPI.deployLanderToNewDomain(attr);
      });

      Moonlander.on("landers:removeCampaignFromLander", function(campaignModel) {
        landersAppAPI.removeCampaignFromLander(campaignModel);
      });
      Moonlander.on("landers:showDuplicateLanderModal", function(attr) {
        landersAppAPI.showDuplicateLanderModal(attr);
      });

      Moonlander.on("landers:showRipNewLanderModal", function(model) {
        landersAppAPI.showRipNewLanderModal(model);
      });

      Moonlander.on("landers:addCampaignToLander", function(attr) {
        landersAppAPI.addCampaignToLander(attr);
      });

      Moonlander.on("landers:showDeployToDomain", function(model) {
        landersAppAPI.showDeployToDomain(model);
      });

      Moonlander.on("landers:showJsSnippetsModal", function(model) {
        landersAppAPI.showJsSnippetsModal(model);
      });
      Moonlander.on("landers:updateAllActiveSnippetNames", function(model) {
        landersAppAPI.updateAllActiveSnippetNames(model);
      });
      Moonlander.on("landers:showAddNewCampaign", function(model) {
        landersAppAPI.showAddNewCampaign(model);
      });
      Moonlander.on("landers:redeploy", function(attr) {
        var landersArray = attr.landersArray;
        var successCallback = attr.successCallback;
        landersAppAPI.redeployLanders(landersArray, successCallback);
      });
      Moonlander.on("landers:showAddNewLanderModal", function() {
        landersAppAPI.showAddNewLanderModal();
      });

      Moonlander.on("landers:list:addLander", function(landerModel) {
        landersAppAPI.addLander(landerModel);
      });

      Moonlander.on("landers:updateTopbarTotals", function(landerModel) {
        landersAppAPI.updateTopbarTotals();
      });

      Moonlander.on("landers:removeSnippetFromAllLanders", function(attr) {
        landersAppAPI.removeSnippetFromAllLanders(attr);
      });

      Moonlander.on("landers:showEditJsSnippetsModal", function(attr) {
        var landerModel = attr.landerModel;
        var snippet_id = attr.snippet_id;
        var showDescription = attr.showDescription;

        landersAppAPI.showEditJsSnippetsModal(landerModel, snippet_id, showDescription);

      });

    });

    return Moonlander.LandersApp;
  });
