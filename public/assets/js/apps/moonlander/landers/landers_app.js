define(["app", "/assets/js/apps/moonlander/landers/list/list_controller.js",
  "/assets/js/common/login/common_login.js",
  "/assets/js/apps/moonlander/landers/right_sidebar/sidebar_controller.js",
  "/assets/js/apps/moonlander/landers/edit/edit_controller.js",
  "/assets/js/apps/moonlander/landers/deploy_to_domain/deploy_to_domain_controller.js",
  "/assets/js/apps/moonlander/landers/add_to_campaign/add_to_campaign_controller.js",
  "/assets/js/apps/moonlander/landers/undeploy_lander/undeploy_controller.js",
  "/assets/js/apps/moonlander/landers/undeploy_campaign/undeploy_controller.js",
  "/assets/js/apps/moonlander/landers/add_new_lander/add_new_lander_controller.js",
  "/assets/js/apps/moonlander/landers/delete_lander/delete_lander_controller.js",
  "/assets/js/apps/moonlander/landers/duplicate_lander/duplicate_lander_controller.js"
  ], 
function(Moonlander, ListController, CommonLogin, SidemenuController, EditController, DeployToDomainController, 
  AddToCampaignController, UndeployLanderController, UndeployCampaignController, AddNewLanderController, DeleteLanderController,
  DuplicateLanderController){
  Moonlander.module("LandersApp", function(LandersApp, Moonlander, Backbone, Marionette, $, _){

    var landersAppAPI = {
      showLanders: function(d){
        Moonlander.landers = {};
        
        Moonlander.navigate("landers");
        CommonLogin.Check(function(){
          ListController.showLanders();
          Moonlander.trigger("header:active", "landers");
        });
      },
      addNewDuplicatedLander: function(model){
        ListController.addNewDuplicatedLander(model);
      },
      deployLanderToNewDomain: function(attr){
        ListController.deployLanderToDomain(attr);
      },
      updateTopbarTotals: function(){
        ListController.updateTopbarTotals();
      },
      showDuplicateLanderModal: function(landerModelToDuplicate){
        DuplicateLanderController.showDuplicateLander(landerModelToDuplicate);
      },
      addCampaignToLander: function(attr){
        ListController.addCampaignToLander(attr);
      },
      showEditLander: function(model){
        EditController.showEditLander(model);
      },
      showDeployToDomain: function(model){
        DeployToDomainController.showDeployLanderToDomain(model);
      },
      showAddToCampaign: function(model){
        AddToCampaignController.showAddToCampaign(model);
      },
      showAddNewLander: function(){
        AddNewLanderController.showAddNewLander();
      },
      showUndeployLander: function(model){
        UndeployLanderController.showUndeployLander(model);
      },
      showRemoveLanderFromCampaignDialog: function(model){
        UndeployCampaignController.showRemoveLanderFromCampaignDialog(model);
      },
      removeCampaignFromLander: function(campaignModel){
        ListController.removeCampaignFromLander(campaignModel);
      },
      loadLandersSideMenu: function(d){
        SidemenuController.loadLandersSideMenu();
      },
      deleteLander: function(model){
        ListController.deleteLander(model);
      },
      showDeleteLanderModal: function(model){
        DeleteLanderController.showDeleteLanderModal(model);
      },
      openSidebar: function(model){
        SidemenuController.openSidebar(model);
      },
      closeSidebar: function(){
        SidemenuController.closeSidebar();
      },
      addLander: function(landerModel){
        ListController.addLander(landerModel);
      }
    };

    Moonlander.on("landers:list", function(){
      landersAppAPI.showLanders();
      landersAppAPI.loadLandersSideMenu();
    });

    Moonlander.on("landers:opensidebar", function(model){
      landersAppAPI.openSidebar(model);
    });

    Moonlander.on("landers:closesidebar", function(){
      landersAppAPI.closeSidebar();
    });

    Moonlander.on("landers:showEdit", function(model){
      landersAppAPI.showEditLander(model);
    });

    Moonlander.on("landers:showUndeploy", function(model){
      landersAppAPI.showUndeployLander(model);
    });

    Moonlander.on("landers:list:deleteLander", function(model){
      landersAppAPI.deleteLander(model);
    });

    Moonlander.on("landers:showDeleteLanderModal", function(model){
      landersAppAPI.showDeleteLanderModal(model);
    });

    Moonlander.on("landers:showRemoveLanderFromCampaignDialog", function(model){
      landersAppAPI.showRemoveLanderFromCampaignDialog(model);
    });

    Moonlander.on("landers:list:addNewDuplicatedLander", function(model){
      landersAppAPI.addNewDuplicatedLander(model);
    });

    Moonlander.on("landers:deployLanderToNewDomain", function(attr){
      landersAppAPI.deployLanderToNewDomain(attr);
    });

    Moonlander.on("landers:removeCampaignFromLander", function(campaignModel){
      landersAppAPI.removeCampaignFromLander(campaignModel);
    });
    Moonlander.on("landers:showDuplicateLanderModal", function(model){
      landersAppAPI.showDuplicateLanderModal(model);
    });


    Moonlander.on("landers:addCampaignToLander", function(attr){
      landersAppAPI.addCampaignToLander(attr);
    });

    Moonlander.on("landers:showDeployToDomain", function(model){
      landersAppAPI.showDeployToDomain(model);
    });

    Moonlander.on("landers:showAddToCampaign", function(model){
      landersAppAPI.showAddToCampaign(model);
    });

    Moonlander.on("landers:showAddNewLander", function(){
      landersAppAPI.showAddNewLander();
    });

    Moonlander.on("landers:list:addLander", function(landerModel){
      landersAppAPI.addLander(landerModel);
    });

    Moonlander.on("landers:updateTopbarTotals", function(landerModel){
      landersAppAPI.updateTopbarTotals();
    });

  });

  return Moonlander.LandersApp;
});