define(["app",
    "assets/js/common/notification",
    "assets/js/jobs/jobs_model",
    "assets/js/apps/landerds/landers/dao/deployed_domain_model"
  ],
  function(Landerds, Notification, JobModel, DeployedDomainModel) {

    var BaseListController = {

      childExpandedId: null,

      filteredCollection: null,

      BaseClassInitialize: function() {
        //reinit the updater
        Landerds.updater.initialize();
      },

      updateTopbarTotals: function() {
        if (this.filteredCollection) {
          this.filteredCollection.updateTotals();
        }
      },

      nameAndNotesFilter: function(filterCriterion) {
        var criterion = filterCriterion.toLowerCase();
        return function(lander) {
          if (lander.get('name').toLowerCase().indexOf(criterion) !== -1 ||
            lander.get('notes_search').toLowerCase().indexOf(criterion) !== -1) {
            return lander;
          }
        };
      },

      domainAndNotesFilter: function(filterCriterion) {
        var criterion = filterCriterion.toLowerCase();
        return function(lander) {
          if (lander.get('domain').toLowerCase().indexOf(criterion) !== -1 ||
            lander.get('notes_search').toLowerCase().indexOf(criterion) !== -1) {
            return lander;
          }
        };
      },

      notesFilter: function(filterCriterion) {
        var criterion = filterCriterion.toLowerCase();
        return function(lander) {
          if (lander.get('notes_search').toLowerCase().indexOf(criterion) !== -1) {
            return lander;
          }
        };
      },

      nameFilter: function(filterCriterion) {
        var criterion = filterCriterion.toLowerCase();
        return function(lander) {
          if (lander.get('name').toLowerCase().indexOf(criterion) !== -1) {
            return lander;
          }
        };
      },

      domainFilter: function(filterCriterion) {
        var criterion = filterCriterion.toLowerCase();
        return function(lander) {
          if (lander.get('domain').toLowerCase().indexOf(criterion) !== -1) {
            return lander;
          }
        };
      },

      //add the lander model to the list
      addRow: function(model) {
        Landerds.trigger('landers:closesidebar');
        Landerds.trigger('groups:closesidebar');
        Landerds.trigger('domains:closesidebar');

        this.filteredCollection.add(model);
        //1. goto page with new lander on it
        this.expandAndShowRow(model);
      },


      //if the model is not on the current page then                 
      expandAndShowRow: function(model) {
        if (this.filteredCollection) {

          this.childExpandedId = model.get("id");
          this.filteredCollection.showPageWithModel(model);
          model.trigger("view:expand");
        }
      },

      showRow: function(model) {
        if (this.filteredCollection) {
          this.filteredCollection.showPageWithModel(model);
        }
      },

      //handles add group deploy as well so must take empty list
      //needs to be able to take empty list, or more
      baseClassDeployLandersToDomain: function(attr) {
        var me = this;

        var landerModel = attr.landerModel;
        var domainListToDeploy = attr.domainListToDeploy;

        var masterDomain = domainListToDeploy[0];

        if (!masterDomain.noDomainsToAdd) {

          //create a list of deployed domain models to create for redeploy
          var deployedDomains = landerModel.get("deployedDomains");
          $.each(domainListToDeploy, function(idx, domainToDeployAttributes) {

            var isDeployed = false;
            deployedDomains.each(function(deployedDomain) {
              if (deployedDomain.get("domain_id") == domainToDeployAttributes.domain_id) {
                isDeployed = true;
              }
            });

            if (!isDeployed) {

              var deployedDomainModel = new DeployedDomainModel(domainToDeployAttributes);
              deployedDomains.add(deployedDomainModel);
              //set to deploying to start
              deployedDomainModel.set("deploy_status", "deploying");

            }

          });
        }
      },


      getLanderRedeployJobs: function(landerModel) {
        var addActiveGroupModel = false;

        //get list of all deployedDomains first
        var deployedDomainsJobList = [];
        var deployedDomainCollection = landerModel.get("deployedDomains");

        //figure out if we need to add the active group if it doesn't have an ID yet
        var activeGroupCollection = landerModel.get("activeGroups");
        activeGroupCollection.each(function(activeGroup) {
          if (!activeGroup.get("id")) {
            addActiveGroupModel = activeGroup;
          }
        });

        //get list of all locations to 
        deployedDomainCollection.each(function(deployedDomain) {
          //check if deployedDomain is undeploying. if it is ignore it!
          var isUndeploying = false;
          var activeJobs = deployedDomain.get("activeJobs");
          activeJobs.each(function(job) {
            if (job.get('action') == "undeployLanderFromDomain") {
              isUndeploying = true;
            }
          });

          //if activegroupmodel and modified we want all of them 
          //-- this handles case where we are undeploying a domain but then add a group to it with that domain
          //if no active group model just this normal
          var addDeployedDomain = false;
          if (landerModel.get("modified")) {

            if (addActiveGroupModel) {
              var isInGroup = false;

              var domainCollection = addActiveGroupModel.get("domains");
              domainCollection.each(function(domain) {
                if (domain.get("domain_id") == deployedDomain.get("domain_id")) {
                  isInGroup = true;
                }
              });

              //dont add it if its undeploying and NOT in the group
              if (isUndeploying && !isInGroup) {
                addDeployedDomain = false;
              } else {
                addDeployedDomain = true;
              }
            } else if (!isUndeploying) {

              addDeployedDomain = true;

            }

          } else {

            //if not modified and no addActiveGroup model we just want to add
            //the NEW deployed domains
            if (!addActiveGroupModel) {
              if (!deployedDomain.get("id")) {
                addDeployedDomain = true;
              }
            }
          }

          if (addDeployedDomain) {
            var isNew = false;
            if (!deployedDomain.get("id")) {
              isNew = true;
            }

            deployedDomainsJobList.push({
              lander_id: deployedDomain.get("lander_id"),
              domain_id: deployedDomain.get("domain_id"),
              action: "deployLanderToDomain",
              deploy_status: "deploying",
              new: isNew
            });
          }
        });

        //NOTE: if deployedDomainsJobList is empty it means we're
        //  . saving the lander! not deploying it (if there is no addActiveGroupModel)

        //if modified we're going to be saving so set saving = true
        //  . this gets set false when the job updateStatus is correct
        if (landerModel.get("modified")) {

          landerModel.set({
            saving_lander: true
          });

        } else {
          //if not modified then this is a light save, or add of active group (to domain/lander)
          //only deploy the new domains from the active group
          if (addActiveGroupModel) {
            var deployedDomainsOnActiveGroup = [];
            var domains = addActiveGroupModel.get("domains");

            //if deployed domain has no id and belongs to this group we deploy it !
            //if deployed domain is not in the group collection dont deploy it            
            deployedDomainCollection.each(function(deployedDomain) {
              var domainDeployed = false;
              if (domains.length > 0) {

                var deployedDomainInGroup = false;

                domains.each(function(domain) {
                  if (deployedDomain.get("domain_id") == domain.get("domain_id") &&
                    deployedDomain.get("id") &&
                    deployedDomain.get("deploy_status") != "undeploying" &&
                    deployedDomain.get("deploy_status") != "undeploy_invalidating") {

                    domainDeployed = true;

                  }


                  if (deployedDomain.get("domain_id") == domain.get("domain_id")) {
                    //also dont deploy it if domain 
                    deployedDomainInGroup = true;
                  }
                });
              } else {
                domainDeployed = true;
              }

              if (!domainDeployed && deployedDomainInGroup) {
                deployedDomainsOnActiveGroup.push({
                  lander_id: deployedDomain.get("lander_id"),
                  domain_id: deployedDomain.get("domain_id"),
                  action: "deployLanderToDomain",
                  deploy_status: "deploying",
                  new: true
                });
              }
            });

            deployedDomainsJobList = deployedDomainsOnActiveGroup;
          }

        }

        return {
          list: deployedDomainsJobList,
          addActiveGroupModel: addActiveGroupModel
        }
      }
    };

    return BaseListController;
  });
