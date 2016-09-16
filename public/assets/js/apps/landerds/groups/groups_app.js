define(["app", 
    "assets/js/apps/landerds/groups/list/list_controller",
    "assets/js/common/login/common_login",
    "assets/js/apps/landerds/groups/right_sidebar/sidebar_controller",
    "assets/js/apps/landerds/groups/add_new_group/add_new_group_controller",
    "assets/js/apps/landerds/groups/add_new_lander/add_new_lander_controller",
    "assets/js/apps/landerds/groups/add_new_domain/add_new_domain_controller",
    "assets/js/apps/landerds/groups/undeploy_lander/undeploy_lander_controller",
    "assets/js/apps/landerds/groups/undeploy_domain/undeploy_domain_controller",
    "assets/js/apps/landerds/groups/remove_group/remove_group_controller",
  ],
  function(Landerds, ListController, CommonLogin, SidemenuController, AddNewGroupController,
    AddNewLanderController, AddNewDomainController, RemoveLanderController, RemoveDomainController,
    RemoveGroupsController) {
    Landerds.module("GroupsApp", function(GroupsApp, Landerds, Backbone, Marionette, $, _) {

      var groupsAppAPI = {
        showGroups: function(id) {
          if (id) {
            Landerds.navigate("groups/show/" + id);
          } else {
            Landerds.navigate("groups");
          }

          CommonLogin.Check(function() {
            ListController.showGroups(id);
            Landerds.trigger("header:active", "groups");
          });
        },

        showAddNewGroupModal: function(model) {
          AddNewGroupController.showAddNewGroupModal(model);
        },

        addGroup: function(model) {
          ListController.addGroup(model);
        },

        showAddNewLander: function(model) {
          AddNewLanderController.showAddNewLander(model);
        },

        deployLanderToGroupsDomains: function(attr) {
          ListController.deployLanderToGroupsDomains(attr);
        },

        showAddNewDomain: function(model) {
          AddNewDomainController.showAddNewDomain(model);
        },

        deployGroupLandersToDomain: function(attr) {
          ListController.deployGroupLandersToDomain(attr);
        },

        openSidebar: function(model) {
          SidemenuController.openSidebar(model);
        },

        closeSidebar: function() {
          SidemenuController.closeSidebar();
        },

        showUndeployLander: function(model) {
          RemoveLanderController.showUndeployLander(model);
        },

        showUndeployDomain: function(model) {
          RemoveDomainController.showUndeployDomain(model);
        },

        updateTopbarTotals: function() {
          ListController.updateTopbarTotals();
        },

        showRemoveGroups: function(model) {
          RemoveGroupsController.showRemoveGroups(model);
        }

      };

      Landerds.on("groups:list", function(id) {
        groupsAppAPI.showGroups(id);
      });

      Landerds.on("groups:opensidebar", function(model) {
        groupsAppAPI.openSidebar(model);
      });

      Landerds.on("groups:closesidebar", function() {
        groupsAppAPI.closeSidebar();
      });

      Landerds.on("groups:showAddNewGroupModal", function(model) {
        groupsAppAPI.showAddNewGroupModal(model);
      });

      Landerds.on("groups:list:addGroup", function(model) {
        groupsAppAPI.addGroup(model);
      });

      Landerds.on("groups:showAddNewLander", function(attr) {
        groupsAppAPI.showAddNewLander(attr);
      });

      Landerds.on("groups:deployLanderToGroupsDomains", function(attr) {
        groupsAppAPI.deployLanderToGroupsDomains(attr);
      });

      Landerds.on("groups:showAddNewDomain", function(model) {
        groupsAppAPI.showAddNewDomain(model);
      });

      Landerds.on("groups:deployGroupLandersToDomain", function(attr) {
        groupsAppAPI.deployGroupLandersToDomain(attr);
      });

      Landerds.on("groups:showUndeployLander", function(model) {
        groupsAppAPI.showUndeployLander(model);
      });

      Landerds.on("groups:showUndeployDomain", function(model) {
        groupsAppAPI.showUndeployDomain(model);
      });

      Landerds.on("groups:showRemoveGroups", function(model) {
        groupsAppAPI.showRemoveGroups(model);
      });


      Landerds.on("groups:updateTopbarTotals", function(landerModel) {
        groupsAppAPI.updateTopbarTotals();
      });

    });

    return Landerds.GroupsApp;
  });
