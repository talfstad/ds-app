define(["app",
    "assets/js/apps/landerds/landers/list/views/list_view",
    "assets/js/apps/landerds/landers/dao/lander_collection",
    "assets/js/common/filtered_paginated/filtered_paginated_collection",
    "assets/js/common/filtered_paginated/paginated_model",
    "assets/js/common/filtered_paginated/paginated_button_view",
    "assets/js/apps/landerds/landers/list/views/topbar_view",
    "assets/js/apps/landerds/landers/list/views/loading_view",
    "assets/js/apps/landerds/landers/list/views/domain_tab_handle_view",
    "assets/js/apps/landerds/landers/list/views/group_tab_handle_view",
    "assets/js/apps/landerds/landers/list/deployed_domains/views/deployed_domains_collection_view",
    "assets/js/apps/landerds/domains/dao/domain_collection",
    "assets/js/apps/landerds/landers/list/active_groups/views/active_groups_collection_view",
    "assets/js/jobs/jobs_model",
    "assets/js/apps/landerds/landers/dao/lander_model",
    "assets/js/apps/landerds/landers/dao/active_group_model",
    "assets/js/common/notification",
    "assets/js/apps/landerds/base_classes/list/list_controller_base",
    "assets/js/apps/landerds/landers/dao/deployed_domain_model",
    "assets/js/apps/help/help_app",
    "assets/js/apps/landerds/landers/list/views/list_layout_view"
  ],
  function(Landerds, ListView, LanderCollection, FilteredPaginatedCollection, PaginatedModel,
    PaginatedButtonView, TopbarView, LoadingView, DeployStatusView, GroupsTabHandleView,
    DeployedDomainsView, DeployedDomainsCollection, ActiveGroupsView,
    JobModel, LanderModel, ActiveGroupModel, Notification, BaseListController, DeployedDomainModel) {
    Landerds.module("LandersApp.Landers.List", function(List, Landerds, Backbone, Marionette, $, _) {

      List.Controller = _.extend({ //BaseListController

        initialize: function() {
          this.BaseClassInitialize();
        },

        showLanders: function(lander_id_to_goto_and_expand) {

          if (lander_id_to_goto_and_expand) {
            this.childExpandedId = lander_id_to_goto_and_expand;
          }

          //init the controller
          this.initialize();

          //make layout for landers
          var me = this;
          var landersListLayout = new List.Layout();
          landersListLayout.render();

          Landerds.rootRegion.currentView.mainContentRegion.show(landersListLayout);

          var loadingView = new LoadingView();
          landersListLayout.landersCollectionRegion.show(loadingView);

          //set initial topbar view crap reloads when data loads
          var topbarView = new TopbarView({
            model: new PaginatedModel
          });

          landersListLayout.topbarRegion.show(topbarView);


          //request landers collection
          var deferredLandersCollection = Landerds.request("landers:landersCollection");

          $.when(deferredLandersCollection).done(function(landersCollection) {

            me.filteredCollection = FilteredPaginatedCollection({
              collection: landersCollection,
              paginated: true,
              page_size: Landerds.loginModel.get("landers_rows_per_page"),
              filterFunction: function(filterCriterion) {
                var criterion = filterCriterion.toLowerCase();
                return function(lander) {
                  if (lander.get('name').toLowerCase().indexOf(criterion) !== -1) {
                    return lander;
                  }
                };
              }
            });

            //when lander is deleted successfully show a notification
            me.filteredCollection.original.on("destroy", function(model) {
              Notification("", "Deleted " + model.get("name"), "success", "stack_top_right");
            });

            me.filteredCollection.original.on("landerFinishAdded", function(model) {
              Notification("", "Added " + model.get("name"), "success", "stack_top_right");
            });

            //make landers view and display data
            var landersListView = new ListView({
              collection: me.filteredCollection
            });
            landersListView.trigger("landers:sort");

            landersListView.on("childview:showAwsTutorial", function() {
              Landerds.trigger("help:showAwsTutorial");
            });

            landersListLayout.on("landers:filterList", function(filterVal) {
              me.filteredCollection.filter(filterVal);
            });

            landersListLayout.on("landers:sort", function() {
              landersListView.trigger("landers:sort");
            });

            landersListLayout.on("landers:changepagesize", function(pageSize) {
              me.filteredCollection.setPageSize(pageSize);
            });

            landersListLayout.on("toggleInfo", function() {
              if (me.filteredCollection) {
                var toggle = this.toggleHelpInfo();

                if (toggle) {
                  //show empty view
                  me.filteredCollection.showEmpty(true);
                } else {
                  //show landersListView
                  me.filteredCollection.showEmpty(false);
                }
              }
            });

            if (landersListLayout.isRendered) {
              landersListLayout.landersCollectionRegion.show(landersListView);
            }

            //this is the pagination pages totals and lander count totals view
            var topbarView = new TopbarView({
              model: me.filteredCollection.state.gui
            });

            //on child expanded save for re-open on reset
            landersListView.on("childview:childExpanded", function(childView, data) {
              me.childExpandedId = childView.model.get("id");
            });
            //on child collapse if is current expanded then reset to null
            landersListView.on("childview:childCollapsed", function(childView, data) {
              var childCollapsedModel = childView.model;
              if (me.childExpandedId == childCollapsedModel.get("id")) {
                me.childExpandedId = null;
              }
            });


            me.filteredCollection.on("reset", function(collection) {

              //on reset we're always going to want to close the sidebar
              //this is important so we dont get weird states
              Landerds.trigger('landers:closesidebar');

              var filteredCollection = this;

              if (this.length > 0) {
                landersListView.children.each(function(landerView) {

                  var domainTabHandleView = new DeployStatusView({
                    model: landerView.model
                  });

                  var groupTabHandleView = new GroupsTabHandleView({
                    model: landerView.model
                  });

                  landerView.on("getLanderNotes", function() {
                    var model = this.model;
                    model.getLanderNotes();
                  });

                  landerView.on("renderAndShowThisViewsPage", function() {
                    me.filteredCollection.sortFiltered();
                    me.expandAndShowRow(landerView.model);
                  });

                  //handles changes, use css its way faster
                  landerView.model.off("change:currentPreviewEndpointId");
                  landerView.model.on("change:currentPreviewEndpointId", function(one, previewId, three) {
                    Landerds.trigger("landers:sidebar:showSidebarActiveSnippetsView", landerView.model);
                  });

                  var activeGroupCollection = landerView.model.get("activeGroups");
                  //set landername to be used by group models dialog
                  activeGroupCollection.landerName = landerView.model.get("name");
                  activeGroupCollection.deploy_status = landerView.model.get("deploy_status");

                  var activeGroupView = new ActiveGroupsView({
                    collection: activeGroupCollection
                  });

                  activeGroupCollection.off("showUndeployDomainFromGroupDialog");
                  activeGroupCollection.on("showUndeployDomainFromGroupDialog", function(groupModel) {
                    var attr = {
                      group_model: groupModel,
                      lander_model: landerView.model
                    };
                    Landerds.trigger("landers:showUndeployDomainFromGroupDialog", attr);
                  });

                  activeGroupView.on("childview:updateParentLayout", function(childView, options) {
                    //update the group count for lander
                    var length = this.children.length;
                    if (childView.isDestroyed) --length;
                    groupTabHandleView.model.set("active_groups_count", length);
                  });

                  var deployedDomainsCollection = landerView.model.get("deployedDomains");

                  deployedDomainsCollection.activeGroups = activeGroupCollection;
                  deployedDomainsCollection.urlEndpoints = landerView.model.get("urlEndpoints");

                  deployedDomainsCollection.lander_model = landerView.model;

                  var deployedDomainsView = new DeployedDomainsView({
                    collection: deployedDomainsCollection
                  });

                  deployedDomainsView.on("childview:showRemoveDomain", function(childView, domainModel) {
                    var attr = {
                      lander_model: landerView.model,
                      domain_model: domainModel
                    };
                    Landerds.trigger("landers:showRemoveDomain", attr);
                  });

                  //when group link selected go to camp tab (this is from deployed domains group name link)
                  deployedDomainsView.on("childview:selectGroupsTab", function(one, two, three) {
                    landerView.$el.find("a[href=#groups-tab-id-" + landerView.model.get("id") + "]").tab('show');
                  });

                  deployedDomainsView.on("childview:updateParentLayout", function(childView, options) {
                    //update the group count for lander
                    var length = this.children.length;
                    if (childView.isDestroyed) --length;
                    domainTabHandleView.model.set("deployed_domains_count", length);
                    landerView.reAlignTableHeader();
                  });

                  landerView.deploy_status_region.show(domainTabHandleView);
                  landerView.group_tab_handle_region.show(groupTabHandleView);
                  landerView.deployed_domains_region.show(deployedDomainsView);
                  landerView.active_groups_region.show(activeGroupView);
                });
              }

              //set topbar totals on reset
              Landerds.trigger("landers:updateTopbarTotals");

              if (me.childExpandedId) {
                //only expand it if its in the current filtered collection
                var modelToExpand = me.filteredCollection.get(me.childExpandedId);
                if (modelToExpand) {
                  modelToExpand.trigger("view:expand");
                }
              }
            });


            var paginatedButtonView = new PaginatedButtonView({
              model: me.filteredCollection.state.gui
            });
            paginatedButtonView.on("firstPage", function(page) {
              me.filteredCollection.getFirstPage();
            });
            paginatedButtonView.on("previousPage", function(page) {
              me.filteredCollection.getPreviousPage();
            });
            paginatedButtonView.on("nextPage", function(page) {
              me.filteredCollection.getNextPage();
            });
            paginatedButtonView.on("lastPage", function(page) {
              me.filteredCollection.getLastPage();
            });
            paginatedButtonView.on("gotoPage", function(page) {
              me.filteredCollection.gotoPage(page);
            });

            if (landersListLayout.isRendered) {
              landersListLayout.footerRegion.show(paginatedButtonView);
              landersListLayout.topbarRegion.show(topbarView);
            }

            var filterVal = $(".list-search").val() || "";
            if (me.filteredCollection.length > 0) {
              me.filteredCollection.filter(filterVal);
            }

            if (me.childExpandedId) {
              var modelToExpand = me.filteredCollection.original.get(me.childExpandedId)
              if (modelToExpand) {
                me.expandAndShowRow(modelToExpand);
              }
            }
          });
        },

        undeployLanderFromDomains: function(undeployAttr) {
          var me = this;

          var landerModel = undeployAttr.landerModel;
          var undeployDomainIdsArr = undeployAttr.undeployDomainIdsArr;

          var lander_id = landerModel.get("id");

          var deployedDomainCollection = landerModel.get("deployedDomains");
          var deployedDomainsJobList = [];

          //find domain in deployed domains and create undeploy job for it
          $.each(undeployDomainIdsArr, function(idx, domainToUndeployId) {

            deployedDomainCollection.each(function(deployedDomain) {

              if (domainToUndeployId == deployedDomain.get("domain_id")) {
                deployedDomainsJobList.push({
                  lander_id: lander_id,
                  domain_id: domainToUndeployId,
                  action: "undeployLanderFromDomain",
                  deploy_status: "undeploying"
                });
              }
            });
          });

          var undeployJobModel = new JobModel({
            action: "undeployLanderFromDomain",
            list: deployedDomainsJobList,
            model: landerModel,
            neverAddToUpdater: true
          });

          var undeployJobAttributes = {
            jobModel: undeployJobModel,
            onSuccess: function(responseJobList) {

              //create job models for each deployed domain and add them!
              deployedDomainCollection.each(function(deployedDomainModel) {
                $.each(responseJobList, function(idx, responseJobAttr) {

                  if (deployedDomainModel.get("domain_id") == responseJobAttr.domain_id) {
                    //create new individual job model for
                    var activeJobs = deployedDomainModel.get("activeJobs");
                    var newUndeployJob = new JobModel(responseJobAttr);

                    //remove active any deploy jobs for this deployed domain
                    activeJobs.each(function(job) {
                      if (job.get("action") == "deployLanderToDomain") {
                        //remove from updater and destroy job
                        Landerds.updater.remove(this);
                        delete job.attributes.id;
                        job.destroy();
                      }
                    });
                    activeJobs.add(newUndeployJob);
                    //call start for each job 
                    Landerds.trigger("job:start", newUndeployJob);
                  }
                });
              });
            }
          };

          Landerds.trigger("job:start", undeployJobAttributes);

        },

        deployLandersToDomain: function(attr) {
          this.addUndeployedDomainRows(attr);
          this.redeployLanders(attr.landerModel);
        },

        addUndeployedDomainRows: function(attr) {
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

        redeployLanders: function(landerModel) {

          var onAfterRedeployCallback = function(responseJobList) {
            if (responseJobList.error && responseJobList.deployment_folder_name) {
              landerModel.set({
                deployment_folder_name: responseJobList.deployment_folder_name,
                originalValueDeploymentFolderName: responseJobList.deployment_folder_name,
                saving_lander: false,
                modified: false
              });
              landerModel.trigger("reset_deployment_name_text");

              Notification("", "Duplicate Deployment Folder", "danger", "stack_top_right");
              return;
            }

            var activeGroupCollection = landerModel.get("activeGroups");
            var deployedDomainCollection = landerModel.get("deployedDomains");

            //redeploy happening so now we're working, not modified
            //set modified false since we are saving
            landerModel.set({
              modified: false
            });

            //its a save job (lander level if there are no deployed domains (or any that are not undeploying))
            var deployedAtLeastOne = false;

            //set the active_group_id if we have one. MUST do this outside of the 
            //add job loop incase there are not any landers to deploy
            $.each(responseJobList, function(idx, responseJobAttr) {
              if (responseJobAttr.active_group_id) {
                activeGroupCollection.each(function(activeGroup) {
                  if (!activeGroup.get("id")) {
                    activeGroup.set("id", responseJobAttr.active_group_id);
                  }
                });
              }
            });

            //create job models for each deployed domain and add them!
            deployedDomainCollection.each(function(deployedDomainModel) {
              $.each(responseJobList, function(idx, responseJobAttr) {

                if (deployedDomainModel.get("domain_id") == responseJobAttr.domain_id) {

                  //set the ID for the deployed domain row if it's new
                  if (responseJobAttr.new && responseJobAttr.deployed_row_id) {
                    deployedDomainModel.set("id", responseJobAttr.deployed_row_id);
                  }

                  //create new individual job model for
                  var activeJobs = deployedDomainModel.get("activeJobs");
                  var newDeployJob = new JobModel(responseJobAttr);

                  //remove active any deploy or undeploy jobs for this deployed domain
                  activeJobs.each(function(job) {
                    if (job.get("action") == "deployLanderToDomain" ||
                      job.get("action") == "undeployLanderFromDomain") {
                      //remove from updater and destroy job
                      job.set("canceled", true);
                      Landerds.updater.remove(this);
                      delete job.attributes.id;
                      job.destroy();
                    }
                  });
                  //if adding a deploy job it cant just be a save
                  deployedAtLeastOne = true;
                  activeJobs.add(newDeployJob);

                  //also add the job to any active groups that have this domain_id
                  activeGroupCollection.each(function(activeGroup) {
                    var domains = activeGroup.get("domains");
                    domains.each(function(domain) {
                      if (domain.get("domain_id") == newDeployJob.get("domain_id")) {
                        var activeGroupActiveJobs = activeGroup.get("activeJobs");
                        activeGroupActiveJobs.add(newDeployJob);
                      }
                    });
                  });

                  //call start for each job 
                  Landerds.trigger("job:start", newDeployJob);
                }
              });
            });

            if (!deployedAtLeastOne) {
              if (responseJobList.length != 1) {
                //just a quick save.. set saving_lander false be done
                landerModel.set("saving_lander", false);
              } else {
                responseJobAttr = responseJobList[0];
                if (responseJobAttr.action == "savingLander") {
                  //add this to the lander active jobs
                  var landerSaveJob = new JobModel(responseJobAttr);

                  var activeJobs = landerModel.get('activeJobs');
                  activeJobs.add(landerSaveJob);
                  Landerds.trigger("job:start", landerSaveJob);
                }
              }
            }
          };

          var landerRedeployAttr = this.getLanderRedeployJobs(landerModel);
          var deployedDomainsJobList = landerRedeployAttr.list;
          var addActiveGroupModel = landerRedeployAttr.addActiveGroupModel;

          var redeployJobModel = new JobModel({
            action: "deployLanderToDomain",
            list: deployedDomainsJobList,
            model: landerModel,
            addActiveGroupModel: addActiveGroupModel,
            neverAddToUpdater: true
          });

          var redeployJobAttributes = {
            jobModel: redeployJobModel,
            onSuccess: onAfterRedeployCallback
          };

          Landerds.trigger("job:start", redeployJobAttributes);

        },

        removeDeployedDomainModelFromCollection: function(deployedDomainToRemove) {
          var lander_id = deployedDomainToRemove.get("lander_id");
          var landerModel = this.filteredCollection.original.get(lander_id);

          var deployedDomains = landerModel.get("deployedDomains");
          deployedDomains.remove(deployedDomainToRemove);
        },


        updateAffectedLanderIdsRemoveActiveSnippets: function(affectedUrlEndpoints) {
          var me = this;

          $.each(affectedUrlEndpoints, function(idx, endpoint) {

            var landerId = endpoint.lander_id;
            var urlEndpointId = endpoint.url_endpoint_id;
            var activeSnippetId = endpoint.active_snippet_id;

            var landerToUpdate = me.filteredCollection.original.get(landerId);
            var urlEndpoints = landerToUpdate.get("urlEndpoints");
            var endpointToUpdate = urlEndpoints.get(urlEndpointId);
            var activeSnippets = endpointToUpdate.get("activeSnippets");
            var activeSnippetToRemove = activeSnippets.get(activeSnippetId);
            //get the url endpoint thats modified 
            if (activeSnippetToRemove) {
              activeSnippets.remove(activeSnippetToRemove);
              //update the sidemenu views
              Landerds.trigger("landers:sidebar:showSidebarActiveSnippetsView", landerToUpdate);

              landerToUpdate.set({
                modified: true,
                no_optimize_on_save: false,
              });

            }
          });
        },

        updateAffectedLanderIdsToModified: function(affectedEndpoints) {
          var me = this;

          $.each(affectedEndpoints, function(idx, endpoint) {
            var landerId = endpoint.lander_id;

            var landerToUpdate = me.filteredCollection.original.get(landerId);

            if (landerToUpdate) {
              landerToUpdate.set({
                modified: true,
                no_optimize_on_save: false
              });
            }

          });

        },

        removeSnippetFromAllLanders: function(attr) {
          var me = this;
          var snippetToRemoveFromLanders = attr.snippet;
          var onSuccessCallback = attr.onSuccess;

          //loop original lander collection to remove active snippet from all url endpoints
          var landersToRedeploy = [];
          var activeSnippetsToRemove = [];

          this.filteredCollection.original.each(function(landerModel) {

            //create a full list of snippets to remove
            var urlEndpointsCollection = landerModel.get("urlEndpoints");
            var tmpActiveSnippetsToRemove = [];
            urlEndpointsCollection.each(function(endpoint) {
              var activeSnippets = endpoint.get("activeSnippets");
              activeSnippets.each(function(activeSnippet) {
                if (activeSnippet.get("snippet_id") == snippetToRemoveFromLanders.get("snippet_id")) {
                  tmpActiveSnippetsToRemove.push(activeSnippet);
                }
              });
            });

            if (tmpActiveSnippetsToRemove.length > 0) {
              //merge this landers active snippets into the main active snippets list
              $.merge(activeSnippetsToRemove, tmpActiveSnippetsToRemove);
              landersToRedeploy.push(landerModel);

              //need to set the deploy status here incase the view isn't currently showing
              //we will still update correctly for topbartotals
              // landerModel.set("deploy_status","deploying");
            }
          });

          //now we have a FULL list of active snippets and landers that we need to remove and redeploy
          if (activeSnippetsToRemove.length <= 0) {
            //none to remove!
            onSuccessCallback();
          } else {
            var activeSnippetsCounter = 0;
            $.each(activeSnippetsToRemove, function(idx, snippetToRemove) {
              snippetToRemove.destroy({
                success: function() {
                  activeSnippetsCounter++;
                  if (activeSnippetsCounter == activeSnippetsToRemove.length) {
                    //all snippets deleted! now redeploy all landers that need to be                  
                    me.redeployLanders(landersToRedeploy, function() {
                      onSuccessCallback();
                    });
                  }
                }
              });
            });
          }

        },

        saveLander: function(modelAttributes) {
          // gives redeployLanders an empty list [] which means we're just saving
          // and it will only save if its modified (handled on the server as well)
          var me = this;

          var landerModel = this.filteredCollection.get(modelAttributes.id);
          if (!landerModel) return false;

          this.redeployLanders(landerModel);

        },

        updateAllActiveSnippetNames: function(savedModel) {

          if (this.filteredCollection) {

            this.filteredCollection.original.each(function(landerModel) {

              var urlEndpointCollection = landerModel.get("urlEndpoints");
              urlEndpointCollection.each(function(endpoint) {

                var activeSnippetsCollection = endpoint.get("activeSnippets");
                activeSnippetsCollection.each(function(snippet) {
                  if (snippet.get("snippet_id") == savedModel.get("snippet_id")) {
                    snippet.set("name", savedModel.get("name"));
                  }
                });
              });
            });
          }
        },

        createLanderFromJobAddToCollection: function(jobModel) {
          //create a new lander model add to collection 

          //create new lander model, add to collection, add job model to it

          var newLanderModel = new LanderModel({
            id: jobModel.get("lander_id"),
            name: jobModel.get("name"),
            created_on: jobModel.get("lander_created_on")
          });

          var activeJobs = newLanderModel.get("activeJobs");
          activeJobs.add(jobModel);

          this.filteredCollection.add(newLanderModel);

          Landerds.trigger("job:start", jobModel);

          this.showRow(newLanderModel);
        },

        addNewDuplicatedLander: function(landerModel) {

          Landerds.trigger('landers:closesidebar');
          this.filteredCollection.add(landerModel);
          //1. goto page with new lander on it
          this.expandAndShowRow(landerModel);
        },

        deleteLander: function(model) {
          var lander_id = model.get("id");
          var landerModel = this.filteredCollection.original.get(lander_id);

          var deleteJobList = [{
            action: "deleteLander",
            lander_id: landerModel.get("id"),
            deploy_status: "deleting"
          }];

          var deleteJobModel = new JobModel({
            action: "deleteLander",
            list: deleteJobList,
            model: landerModel,
            neverAddToUpdater: true
          });

          var deleteJobAttributes = {
            jobModel: deleteJobModel,
            onSuccess: function(responseJobList) {

              if (responseJobList.length > 0) {
                var deleteLanderAttr = responseJobList[0];

                var jobModel = new JobModel(deleteLanderAttr);

                var activeJobCollection = landerModel.get("activeJobs");
                activeJobCollection.add(jobModel);

                Landerds.trigger("job:start", jobModel);
              }
            }
          };

          Landerds.trigger("job:start", deleteJobAttributes);

        }

      }, BaseListController);
    });

    return Landerds.LandersApp.Landers.List.Controller;
  });
