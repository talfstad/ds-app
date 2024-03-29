define(["app",
    "assets/js/apps/landerds/domains/list/list_controller",
    "assets/js/apps/landerds/common/login/common_login",
    "assets/js/apps/landerds/domains/right_sidebar/sidebar_controller",
    "assets/js/apps/landerds/domains/add_new_domain/add_new_domain_controller",
    "assets/js/apps/landerds/domains/deploy_new_lander/deploy_new_lander_controller",
    "assets/js/apps/landerds/domains/delete_domain/delete_domain_controller",
    "assets/js/apps/landerds/domains/undeploy_lander/undeploy_controller",
    "assets/js/apps/landerds/domains/add_to_group/add_to_group_controller",
    "assets/js/apps/landerds/domains/undeploy_group/undeploy_controller"
  ],
  function(Landerds, ListController, CommonLogin, SidemenuController, AddNewDomainController,
    DeployNewLanderController, DeleteDomainController, UndeployLanderController, AddToGroupController,
    UndeployGroupController) {
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

        removeDeployedLanderModelFromCollection: function(model) {
          ListController.removeDeployedLanderModelFromCollection(model);
        },

        undeployLandersFromDomain: function(attr) {
          ListController.undeployLandersFromDomain(attr);
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
          ListController.addRow(domainModel);
        },

        deleteDomain: function(model) {
          ListController.deleteDomain(model);
        },

        showDeployNewLander: function(model) {
          DeployNewLanderController.showDeployNewLander(model);
        },

        deployLandersToDomain: function(attr) {
          ListController.deployLandersToDomain(attr);
        },

        showUndeployLander: function(model) {
          UndeployLanderController.showUndeployLander(model);
        },

        showAddNewGroup: function(model) {
          AddToGroupController.showAddNewGroup(model);
        },

        deployGroupLandersToDomain: function(attr) {
          ListController.deployGroupLandersToDomain(attr);
        },

        showUndeployDomainFromGroupDialog: function(model) {
          UndeployGroupController.showUndeployDomainFromGroupDialog(model);
        },

        removeGroupFromDomain: function(groupModel) {
          ListController.removeGroupFromDomain(groupModel);
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

      Landerds.on("domains:deployLandersToDomain", function(attr) {
        domainsAppAPI.deployLandersToDomain(attr);
      });

      Landerds.on("domains:removeDeployedLanderModelFromCollection", function(model) {
        domainsAppAPI.removeDeployedLanderModelFromCollection(model);
      });

      Landerds.on("domains:showUndeployLander", function(model) {
        domainsAppAPI.showUndeployLander(model);
      });

      Landerds.on("domains:showAddNewGroup", function(model) {
        domainsAppAPI.showAddNewGroup(model);
      });

      Landerds.on("domains:undeployLandersFromDomain", function(attr) {
        domainsAppAPI.undeployLandersFromDomain(attr);
      });

      Landerds.on("domains:deployGroupLandersToDomain", function(attr) {
        domainsAppAPI.deployGroupLandersToDomain(attr);
      });

      Landerds.on("domains:showUndeployDomainFromGroupDialog", function(attr) {
        domainsAppAPI.showUndeployDomainFromGroupDialog(attr);
      });

      Landerds.on("domains:removeGroupFromDomain", function(model) {
        domainsAppAPI.removeGroupFromDomain(model);
      });



      ////above functions are certain they belong, below aren't sure yet

      Landerds.on("domains:updateTopbarTotals", function(landerModel) {
        domainsAppAPI.updateTopbarTotals();
      });

    });

    return Landerds.DomainsApp;
  });
