define(["app",
    "assets/js/apps/landerds/landers/list/list_controller",
    "assets/js/apps/landerds/common/login/common_login",
    "assets/js/apps/landerds/landers/right_sidebar/sidebar_controller",
    "assets/js/apps/landerds/landers/edit/edit_controller",
    "assets/js/apps/landerds/landers/deploy_to_domain/deploy_to_domain_controller",
    "assets/js/apps/landerds/landers/add_to_group/add_to_group_controller",
    "assets/js/apps/landerds/landers/undeploy_domain/undeploy_domain_controller",
    "assets/js/apps/landerds/landers/undeploy_group/undeploy_group_controller",
    "assets/js/apps/landerds/landers/add_lander/add_lander_controller",
    "assets/js/apps/landerds/landers/delete_lander/delete_lander_controller",
    "assets/js/apps/landerds/landers/duplicate_lander/duplicate_lander_controller",
    "assets/js/apps/landerds/landers/rip_lander/rip_lander_controller",
    "assets/js/apps/landerds/landers/js_snippets/js_snippets_controller",
    "assets/js/apps/landerds/landers/report_broken/report_broken_controller"
  ],
  function(Landerds, ListController, CommonLogin, SidemenuController, EditController, DeployToDomainController,
    AddNewGroupController, RemoveDomainController, RemoveGroupsController, AddNewLanderController, DeleteLanderController,
    DuplicateLanderController, RipNewLanderController, JsSnippetsController, ReportBrokenController) {
    Landerds.module("LandersApp", function(LandersApp, Landerds, Backbone, Marionette, $, _) {

      var landersAppAPI = {
        showLanders: function(id) {
          Landerds.landers = {};
          if (id) {
            Landerds.navigate("landers/show/" + id);
          } else {
            Landerds.navigate("landers");
          }
          CommonLogin.Check(function() {
            ListController.showLanders(id);
            Landerds.trigger("header:active", "landers");
          });
        },
        showAddLanderHelp: function() {
          ListController.showAddLanderHelp();
        },
        showDeploymentFolderHelp: function() {
          ListController.showDeploymentFolderHelp();
        },
        showReportBroken: function(model) {
          ReportBrokenController.showReportBroken(model);
        },
        showCancelRipLander: function(model) {
          RipNewLanderController.showCancelRipLander(model);
        },
        showCancelAddLander: function(model) {
          AddNewLanderController.showCancelAddLander(model);
        },
        removeDeployedDomainModelFromCollection: function(model) {
          ListController.removeDeployedDomainModelFromCollection(model);
        },
        undeployLanderFromDomains: function(undeployAttr) {
          ListController.undeployLanderFromDomains(undeployAttr);
        },
        addNewDuplicatedLander: function(model) {
          ListController.addNewDuplicatedLander(model);
        },
        redeployLanders: function(model) {
          ListController.redeployLanders(model);
        },
        saveLander: function(model) {
          ListController.saveLander(model);
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
        deployLandersToDomain: function(attr) {
          ListController.deployLandersToDomain(attr);
        },
        showJsSnippetsModal: function(model) {
          JsSnippetsController.showJsSnippetsModal(model);
        },
        showEmptyJsSnippetsModal: function(model) {
          JsSnippetsController.showEmptyJsSnippetsModal(model);
        },
        updateTopbarTotals: function() {
          ListController.updateTopbarTotals();
        },
        updateAffectedLanderIdsToModified: function(affectedLanderIds) {
          ListController.updateAffectedLanderIdsToModified(affectedLanderIds);
        },
        updateAffectedLanderIdsRemoveActiveSnippets: function(affectedLanderIds) {
          ListController.updateAffectedLanderIdsRemoveActiveSnippets(affectedLanderIds);
        },
        showDuplicateLanderModal: function(landerModelToDuplicateAttr) {
          DuplicateLanderController.showDuplicateLander(landerModelToDuplicateAttr);
        },
        addGroupToLander: function(attr) {
          ListController.addGroupToLander(attr);
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
        showAddNewGroup: function(model) {
          AddNewGroupController.showAddNewGroup(model);
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
        showUndeployDomainFromGroupDialog: function(attr) {
          RemoveGroupsController.showUndeployDomainFromGroupDialog(attr);
        },
        removeGroupsFromLander: function(groupModel) {
          ListController.removeGroupsFromLander(groupModel);
        },
        updateToModified: function() {
          SidemenuController.updateToModified();
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
        createLanderFromJobAddToCollection: function(landerModel) {
          ListController.createLanderFromJobAddToCollection(landerModel);
        },
        deployGroupLandersToDomain: function(attr) {
          ListController.deployGroupLandersToDomain(attr);
        }
      };

      Landerds.on("landers:removeDeployedDomainModelFromCollection", function(model) {
        landersAppAPI.removeDeployedDomainModelFromCollection(model);
      });

      Landerds.on("landers:deployGroupLandersToDomain", function(attr) {
        landersAppAPI.deployGroupLandersToDomain(attr);
      });

      Landerds.on("landers:list", function(id) {
        landersAppAPI.showLanders(id);
      });

      Landerds.on("landers:opensidebar", function(model) {
        landersAppAPI.openSidebar(model);
      });

      Landerds.on("landers:closesidebar", function() {
        landersAppAPI.closeSidebar();
      });

      Landerds.on("landers:updateToModified", function() {
        landersAppAPI.updateToModified();
      });

      Landerds.on("landers:updateAffectedLanderIdsToModified", function(affectedLanderIds) {
        landersAppAPI.updateAffectedLanderIdsToModified(affectedLanderIds);
      });

      Landerds.on("landers:updateAffectedLanderIdsRemoveActiveSnippets", function(affectedLanderIds) {
        landersAppAPI.updateAffectedLanderIdsRemoveActiveSnippets(affectedLanderIds);
      });

      Landerds.on("landers:showEdit", function(model) {
        landersAppAPI.showEditLander(model);
      });

      Landerds.on("landers:showRemoveDomain", function(model) {
        landersAppAPI.showRemoveDomain(model);
      });

      Landerds.on("landers:list:deleteLander", function(model) {
        landersAppAPI.deleteLander(model);
      });

      Landerds.on("landers:sidebar:showSidebarActiveSnippetsView", function(model) {
        landersAppAPI.showAndReFilterActiveSnippetsView(model);
      });

      Landerds.on("landers:showDeleteLanderModal", function(model) {
        landersAppAPI.showDeleteLanderModal(model);
      });
      Landerds.on("landers:showDeploymentFolderHelp", function() {
        landersAppAPI.showDeploymentFolderHelp();
      });
      Landerds.on("landers:showAddLanderHelp", function() {
        landersAppAPI.showAddLanderHelp();
      });
      Landerds.on("landers:showReportBrokenModal", function(model) {
        landersAppAPI.showReportBroken(model);
      });

      Landerds.on("landers:showUndeployDomainFromGroupDialog", function(attr) {
        landersAppAPI.showUndeployDomainFromGroupDialog(attr);
      });

      Landerds.on("landers:list:addNewDuplicatedLander", function(model) {
        landersAppAPI.addNewDuplicatedLander(model);
      });

      Landerds.on("landers:deployLandersToDomain", function(attr) {
        landersAppAPI.deployLandersToDomain(attr);
      });

      Landerds.on("landers:removeGroupsFromLander", function(groupModel) {
        landersAppAPI.removeGroupsFromLander(groupModel);
      });
      Landerds.on("landers:showDuplicateLanderModal", function(attr) {
        landersAppAPI.showDuplicateLanderModal(attr);
      });

      Landerds.on("landers:showRipNewLanderModal", function(model) {
        landersAppAPI.showRipNewLanderModal(model);
      });
      Landerds.on("landers:undeployLanderFromDomains", function(undeployAttr) {
        landersAppAPI.undeployLanderFromDomains(undeployAttr);
      });
      Landerds.on("landers:addGroupToLander", function(attr) {
        landersAppAPI.addGroupToLander(attr);
      });
      Landerds.on("landers:cancelRipLander", function(model) {
        landersAppAPI.showCancelRipLander(model);
      });
      Landerds.on("landers:cancelAddLander", function(model) {
        landersAppAPI.showCancelAddLander(model);
      });
      Landerds.on("landers:showDeployToDomain", function(model) {
        landersAppAPI.showDeployToDomain(model);
      });
      Landerds.on("landers:showEmptyJsSnippetsModal", function(model) {
        landersAppAPI.showEmptyJsSnippetsModal(model);
      });
      Landerds.on("landers:showJsSnippetsModal", function(model) {
        landersAppAPI.showJsSnippetsModal(model);
      });
      Landerds.on("landers:updateAllActiveSnippetNames", function(model) {
        landersAppAPI.updateAllActiveSnippetNames(model);
      });
      Landerds.on("landers:showAddNewGroup", function(model) {
        landersAppAPI.showAddNewGroup(model);
      });
      Landerds.on("landers:redeploy", function(model) {
        landersAppAPI.redeployLanders(model);
      });
      Landerds.on("landers:save", function(model) {
        landersAppAPI.saveLander(model);
      });

      Landerds.on("landers:showAddNewLanderModal", function() {
        landersAppAPI.showAddNewLanderModal();
      });

      Landerds.on("landers:list:createLanderFromJobAddToCollection", function(jobModel) {
        landersAppAPI.createLanderFromJobAddToCollection(jobModel);
      });

      Landerds.on("landers:updateTopbarTotals", function(landerModel) {
        landersAppAPI.updateTopbarTotals();
      });

      Landerds.on("landers:removeSnippetFromAllLanders", function(attr) {
        landersAppAPI.removeSnippetFromAllLanders(attr);
      });

      Landerds.on("landers:showEditJsSnippetsModal", function(attr) {
        var landerModel = attr.landerModel;
        var snippet_id = attr.snippet_id;
        var showDescription = attr.showDescription;

        landersAppAPI.showEditJsSnippetsModal(landerModel, snippet_id, showDescription);

      });

    });

    return Landerds.LandersApp;
  });
