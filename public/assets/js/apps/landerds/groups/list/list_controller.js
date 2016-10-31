define(["app",
    "assets/js/apps/landerds/groups/list/views/list_view",
    "assets/js/apps/landerds/common/filtered_paginated/filtered_paginated_collection",
    "assets/js/apps/landerds/common/filtered_paginated/paginated_model",
    "assets/js/apps/landerds/common/filtered_paginated/paginated_button_view",
    "assets/js/apps/landerds/groups/list/views/topbar_view",
    "assets/js/apps/landerds/groups/list/views/loading_view",
    "assets/js/apps/landerds/groups/list/views/lander_tab_handle_view",
    "assets/js/apps/landerds/groups/list/views/domain_tab_handle_view",
    "assets/js/apps/landerds/groups/list/deployed_landers/views/deployed_landers_collection_view",
    "assets/js/apps/landerds/groups/list/domains/views/domains_collection_view",
    "assets/js/apps/landerds/domains/dao/deployed_lander_model",
    "assets/js/apps/landerds/groups/dao/domain_list_model",
    "assets/js/apps/landerds/jobs/jobs_model",
    "assets/js/apps/landerds/common/notification",
    "assets/js/apps/landerds/base_classes/list/list_controller_base",
    "assets/js/apps/landerds/help/help_app",
    "assets/js/apps/landerds/groups/dao/group_collection",
    "assets/js/apps/landerds/groups/list/views/list_layout_view"
  ],
  function(Landerds, ListView, FilteredPaginatedCollection, PaginatedModel,
    PaginatedButtonView, TopbarView, LoadingView, LanderTabHandleView, DomainTabHandleView,
    DeployedLandersView, DomainListView, DeployedLanderModel, DomainListModel,
    JobModel, Notification, BaseListController) {
    Landerds.module("GroupsApp.Groups.List", function(List, Landerds, Backbone, Marionette, $, _) {

      List.Controller = _.extend({ //BaseListController

        initialize: function() {
          this.BaseClassInitialize();
        },

        showGroups: function(group_id_to_goto_and_expand) {
          if (group_id_to_goto_and_expand) {
            this.childExpandedId = group_id_to_goto_and_expand;
          }

          //init the controller
          this.initialize();

          //make layout for groups
          var me = this;
          var groupListLayout = new List.Layout();
          groupListLayout.render();

          Landerds.rootRegion.currentView.mainContentRegion.show(groupListLayout);

          var loadingView = new LoadingView();
          groupListLayout.groupCollectionRegion.show(loadingView);


          //set initial topbar view crap reloads when data loads
          var topbarView = new TopbarView({
            model: new PaginatedModel
          });

          groupListLayout.topbarRegion.show(topbarView);

          //request groups collection
          var deferredGroupCollection = Landerds.request("groups:groupCollection");

          var defaultSearchFilter = me.nameFilter;

          $.when(deferredGroupCollection).done(function(groupCollection) {

            me.filteredCollection = FilteredPaginatedCollection({
              collection: groupCollection,
              paginated: true,
              page_size: Landerds.loginModel.get("groups_rows_per_page"),
              filterFunction: defaultSearchFilter
            });

            groupListLayout.on("updateSearchFunction", function(searchCriteria, two, three) {
              if (searchCriteria.searchName && searchCriteria.searchNotes) {
                me.filteredCollection.filterFunction = me.nameAndNotesFilter;
              } else if (searchCriteria.searchNotes) {
                me.filteredCollection.filterFunction = me.notesFilter;
              } else {
                me.filteredCollection.filterFunction = me.nameFilter;
              }
            });

            //make landers view and display data
            var groupListView = new ListView({
              collection: me.filteredCollection
            });
            groupListView.trigger("groups:sort");

            groupListView.on("childview:showAwsTutorial", function() {
              Landerds.trigger("help:showAwsTutorial");
            });

            groupListLayout.on("groups:filterList", function(filterVal) {
              me.filteredCollection.filter(filterVal);
            });

            groupListLayout.on("groups:sort", function() {
              groupListView.trigger("groups:sort");
            });

            groupListLayout.on("groups:changepagesize", function(pageSize) {
              me.filteredCollection.setPageSize(pageSize);
            });

            groupListLayout.on("toggleInfo", function() {
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

            if (groupListLayout.isRendered) {
              groupListLayout.groupCollectionRegion.show(groupListView);
            }

            //this is the pagination pages totals and lander count totals view
            var topbarView = new TopbarView({
              model: me.filteredCollection.state.gui
            });

            //on child expanded save for re-open on reset
            groupListView.on("childview:childExpanded", function(childView, data) {
              me.childExpandedId = childView.model.get("id");
            });
            //on child collapse if is current expanded then reset to null
            groupListView.on("childview:childCollapsed", function(childView, data) {
              var childCollapsedModel = childView.model;
              if (me.childExpandedId == childCollapsedModel.get("id")) {
                me.childExpandedId = null;
              }
            });

            me.filteredCollection.on("reset", function(collection) {

              //on reset we're always going to want to close the sidebar
              //this is important so we dont get weird states
              Landerds.trigger('groups:closesidebar');

              var filteredCollection = this;

              if (this.length > 0) {
                groupListView.children.each(function(groupView) {

                  var landerTabHandleView = new LanderTabHandleView({
                    model: groupView.model
                  });

                  var domainTabHandleView = new DomainTabHandleView({
                    model: groupView.model
                  });

                  groupView.on("getNotes", function() {
                    var model = this.model;
                    model.getNotes();
                  });

                  groupView.on("renderAndShowThisViewsPage", function() {
                    me.filteredCollection.sortFiltered();
                    me.expandAndShowRow(groupView.model);
                  });

                  var domainListCollection = groupView.model.get("domains");
                  //set landername to be used by group models dialog
                  // domainListCollection.name = groupView.model.get("name");
                  domainListCollection.group_id = groupView.model.get("id");

                  var domainListView = new DomainListView({
                    collection: domainListCollection
                  });

                  domainListCollection.off("showUndeployDomain");
                  domainListCollection.on("showUndeployDomain", function(domainModel) {
                    var attr = {
                      group_model: groupView.model,
                      domain_model: domainModel
                    };
                    Landerds.trigger("groups:showUndeployDomain", attr);
                  });

                  domainListView.on("childview:updateParentLayout", function(childView, options) {
                    //update the group count for lander
                    var length = this.children.length;
                    if (childView.isDestroyed) --length;
                    domainTabHandleView.model.set("domains_count", length);
                  });


                  var deployedLandersCollection = groupView.model.get("deployedLanders");
                  //give landers deployed domains ref
                  deployedLandersCollection.domainListCollection = domainListCollection;

                  var deployedLandersView = new DeployedLandersView({
                    collection: deployedLandersCollection
                  });

                  deployedLandersCollection.off("showUndeployLander");
                  deployedLandersCollection.on("showUndeployLander", function(landerModel) {
                    var attr = {
                      group_model: groupView.model,
                      lander_model: landerModel
                    };
                    Landerds.trigger("groups:showUndeployLander", attr);
                  });

                  deployedLandersView.on("childview:updateParentLayout", function(childView, options) {
                    //update the group count for lander
                    var length = this.children.length;
                    if (childView.isDestroyed) --length;
                    domainTabHandleView.model.set("deployed_landers_count", length);
                    groupView.reAlignTableHeader();

                  });

                  //when group link selected go to camp tab (this is from deployed domains group name link)
                  deployedLandersView.on("childview:selectGroupsTab", function(one, two, three) {
                    groupView.$el.find("a[href=#domains-tab-id-" + groupView.model.get("id") + "]").tab('show')
                  });

                  landerTabHandleView.on("reAlignHeader", function() {
                    groupView.reAlignTableHeader();
                  });

                  groupView.lander_tab_handle_region.show(landerTabHandleView);
                  groupView.domain_tab_handle_region.show(domainTabHandleView);
                  groupView.deployed_landers_region.show(deployedLandersView);
                  groupView.domains_region.show(domainListView);
                });
              }

              //set topbar totals on reset
              Landerds.trigger("groups:updateTopbarTotals");

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

            if (groupListLayout.isRendered) {
              groupListLayout.footerRegion.show(paginatedButtonView);
              groupListLayout.topbarRegion.show(topbarView);
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

        deployNewInGroup: function(groupModel) {
          var domainsInGroupCollection = groupModel.get("domains");

          //trigger a deploy to correctly deploy the new stuff

          //get a list of the new landers (deployed landers without ID)
          var listOfNewDeployJobs = [];
          var deployedLanders = groupModel.get("deployedLanders");
          deployedLanders.each(function(deployedLander) {

            var modified = deployedLander.get("modified");
            var deployedDomains = deployedLander.get("deployedDomains");
            var isNewDeployedLander = (!deployedLander.get("id"));

            if (modified && isNewDeployedLander && domainsInGroupCollection.length > 0) {
              //add redeploy jobs here for new deployed landers and lander will get deployed
              deployedDomains.each(function(deployedDomain) {
                listOfNewDeployJobs.push({
                  lander_id: deployedLander.get("lander_id"),
                  domain_id: deployedDomain.get("domain_id"),
                  action: "deployLanderToDomain",
                  deploy_status: "deploying"
                });
              });
            }

            //adding new jobs not deployed yet
            domainsInGroupCollection.each(function(domain) {
              //if not already deployed push it
              //check deployedLanders deployed domains for this domain, if not exist push
              var isDeployed = false;

              deployedDomains.each(function(deployedDomain) {
                if (deployedDomain.get("domain_id") == domain.get("domain_id")) {
                  isDeployed = true;
                }
              });

              if (!isDeployed) {
                listOfNewDeployJobs.push({
                  lander_id: deployedLander.get("lander_id"),
                  domain_id: domain.get("domain_id"),
                  action: "deployLanderToDomain",
                  deploy_status: "deploying",
                  new: true
                });
              }

            });
          });

          //follow the deployToDomain pattern used in landers/domains
          var onAfterRedeployCallback = function(responseJobList) {

            //add the jobs to deployed lander, if deployed domain is in domains add it to that too
            var deployedLanderCollection = groupModel.get("deployedLanders");
            var domainsInGroupCollection = groupModel.get("domains");
            //set the active_group_id if we have one. MUST do this outside of the 
            //add job loop incase there are not any landers to deploy
            $.each(responseJobList, function(idx, responseJobAttr) {
              if (responseJobAttr.active_group_id) {
                if (groupModel.get("action") == "lander") {
                  //find the one lander without an id
                  deployedLanderCollection.each(function(deployedLander) {
                    if (!deployedLander.get("id")) {
                      deployedLander.set("id", responseJobAttr.active_group_id);
                    }
                  });
                } else if (groupModel.get("action") == "domain") {
                  //find the one domain without an id
                  domainsInGroupCollection.each(function(domain) {
                    if (!domain.get("id")) {
                      domain.set("id", responseJobAttr.active_group_id);
                    }
                  });
                }
              }
            });


            //create job models for each deployed lander and add them!
            deployedLanderCollection.each(function(deployedLanderModel) {
              $.each(responseJobList, function(idx, responseJobAttr) {

                if (deployedLanderModel.get("lander_id") == responseJobAttr.lander_id) {

                  //set the ID for the deployed domain row if it's new
                  if (responseJobAttr.new && responseJobAttr.deployed_row_id) {
                    deployedLanderModel.set("id", responseJobAttr.deployed_row_id);
                  }

                  //create new individual job model for
                  var activeJobs = deployedLanderModel.get("activeJobs");
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
                  activeJobs.add(newDeployJob);

                  //also add the job to any active groups that have this domain_id
                  domainsInGroupCollection.each(function(domain) {
                    if (domain.get("domain_id") == newDeployJob.get("domain_id")) {
                      var domainActiveJobs = domain.get("activeJobs");
                      domainActiveJobs.add(newDeployJob);
                    }
                  });

                  //call start for each job 
                  Landerds.trigger("job:start", newDeployJob);
                }
              });
            });
          };

          var deployNewInGroupJob = new JobModel({
            action: "deployLanderToDomain",
            list: listOfNewDeployJobs,
            addActiveGroupModel: groupModel,
            neverAddToUpdater: true
          });

          var deployNewInGroupAttributes = {
            jobModel: deployNewInGroupJob,
            onSuccess: onAfterRedeployCallback
          };

          Landerds.trigger("job:start", deployNewInGroupAttributes);


        },

        addGroup: function(model) {
          this.addRow(model);
          this.expandAndShowRow(model);
        }


      }, BaseListController);
    });

    return Landerds.GroupsApp.Groups.List.Controller;
  });
