define(["app",
    "assets/js/apps/landerds/groups/list/views/list_view",
    "assets/js/common/filtered_paginated/filtered_paginated_collection",
    "assets/js/common/filtered_paginated/paginated_model",
    "assets/js/common/filtered_paginated/paginated_button_view",
    "assets/js/apps/landerds/groups/list/views/topbar_view",
    "assets/js/apps/landerds/groups/list/views/loading_view",
    "assets/js/apps/landerds/groups/list/views/lander_tab_handle_view",
    "assets/js/apps/landerds/groups/list/views/domain_tab_handle_view",
    "assets/js/apps/landerds/groups/list/deployed_landers/views/deployed_landers_collection_view",
    "assets/js/apps/landerds/groups/list/domains/views/domains_collection_view",
    "assets/js/apps/landerds/domains/dao/deployed_lander_model",
    "assets/js/apps/landerds/groups/dao/domain_list_model",
    "assets/js/jobs/jobs_model",
    "assets/js/common/notification",
    "assets/js/apps/landerds/base_classes/list/list_controller_base",
    "assets/js/apps/help/help_app",
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
          var groupsListLayout = new List.Layout();
          groupsListLayout.render();

          Landerds.rootRegion.currentView.mainContentRegion.show(groupsListLayout);

          var loadingView = new LoadingView();
          groupsListLayout.groupsCollectionRegion.show(loadingView);


          //set initial topbar view crap reloads when data loads
          var topbarView = new TopbarView({
            model: new PaginatedModel
          });

          groupsListLayout.topbarRegion.show(topbarView);

          //request groups collection
          var deferredGroupsCollection = Landerds.request("groups:groupsCollection");

          $.when(deferredGroupsCollection).done(function(groupCollection) {

            me.filteredCollection = FilteredPaginatedCollection({
              collection: groupCollection,
              paginated: true,
              filterFunction: function(filterCriterion) {
                var criterion = filterCriterion.toLowerCase();
                return function(lander) {
                  if (lander.get('name').toLowerCase().indexOf(criterion) !== -1) {
                    return lander;
                  }
                };
              }
            });

            //make landers view and display data
            var groupsListView = new ListView({
              collection: me.filteredCollection
            });

            groupsListView.on("childview:showAwsTutorial", function() {
              Landerds.trigger("help:showAwsTutorial");
            });

            groupsListLayout.on("groups:filterList", function(filterVal) {
              me.filteredCollection.filter(filterVal);
            });

            groupsListLayout.on("groups:sort", function() {
              groupsListView.trigger("groups:sort");
            });

            groupsListLayout.on("groups:changepagesize", function(pageSize) {
              me.filteredCollection.setPageSize(pageSize);
            });

            groupsListLayout.on("toggleInfo", function() {
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

            if (groupsListLayout.isRendered) {
              groupsListLayout.groupsCollectionRegion.show(groupsListView);
            }

            //this is the pagination pages totals and lander count totals view
            var topbarView = new TopbarView({
              model: me.filteredCollection.state.gui
            });

            //on child expanded save for re-open on reset
            groupsListView.on("childview:childExpanded", function(childView, data) {
              me.childExpandedId = childView.model.get("id");
            });
            //on child collapse if is current expanded then reset to null
            groupsListView.on("childview:childCollapsed", function(childView, data) {
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
                groupsListView.children.each(function(groupView) {

                  var landerTabHandleView = new LanderTabHandleView({
                    model: groupView.model
                  });

                  var domainTabHandleView = new DomainTabHandleView({
                    model: groupView.model
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

            if (groupsListLayout.isRendered) {
              groupsListLayout.footerRegion.show(paginatedButtonView);
              groupsListLayout.topbarRegion.show(topbarView);
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

        // deployGroupsLandersToDomain: function(attr) {

        //   var groupModel = attr.group_model;
        //   var domainListModel = attr.domain_list_model;

        //   var domainList = groupModel.get("domains");

        //   if (!domainListModel) {
        //     return false;
        //   }

        //   var group_id = groupModel.get("id");

        //   var deployedDomainModelActiveJobs = domainListModel.get("activeJobs");

        //   var deployedLandersCollection = groupModel.get("deployedLanders");
        //   deployedLandersCollection.each(function(deployedLanderModel) {

        //     //if there are any landers set deploy status to deploying
        //     domainListModel.set("deploy_status", "deploying");

        //     var deployedLanderModelActiveJobs = deployedLanderModel.get("activeJobs");


        //     //create deploy job for domain and add it to the domain and the lander model
        //     var jobAttributes = {
        //       action: "deployLanderToDomain",
        //       lander_id: deployedLanderModel.get("lander_id") || deployedLanderModel.get("id"),
        //       domain_id: domainListModel.get("domain_id") || domainListModel.get("id"),
        //       group_id: group_id,
        //       deploy_status: "deploying"
        //     };
        //     var jobModel = new JobModel(jobAttributes);

        //     deployedLanderModelActiveJobs.add(jobModel);

        //     deployedDomainModelActiveJobs.add(jobModel);

        //     Landerds.trigger("job:start", jobModel);

        //   });

        //   if (deployedLandersCollection.length <= 0) {
        //     domainListModel.set("deploy_status", "deployed");
        //   }

        //   domainList.add(domainListModel);


        // },


        // deployLanderToGroupsDomains: function(attr) {
        //   var groupModel = attr.group_model;
        //   var deployedLanderModel = attr.deployed_lander_model;

        //   var deployedLanders = groupModel.get("deployedLanders");

        //   if (!deployedLanderModel) {
        //     return false;
        //   }

        //   var group_id = groupModel.get("id");

        //   var deployedLanderModelActiveJobs = deployedLanderModel.get("activeJobs");

        //   //now we have lander model, we can create our jobs
        //   var domainListCollection = groupModel.get("domains");

        //   //notification that deployment may take up to 20 minutes
        //   if (domainListCollection.length > 1) {
        //     // Notification("Deploying Landing Pages", "May take up to 20 minutes", "success", "stack_top_right");
        //   } else {
        //     // Notification("Deploying Landing Page", "May take up to 20 minutes", "success", "stack_top_right");
        //   }

        //   domainListCollection.each(function(deployedDomainModel) {

        //     //if there are any domains set deploy status to deploying
        //     deployedLanderModel.set("deploy_status", "deploying");

        //     var deployedDomainModelActiveJobs = deployedDomainModel.get("activeJobs");


        //     //create deploy job for domain and add it to the domain and the lander model
        //     var jobAttributes = {
        //       action: "deployLanderToDomain",
        //       lander_id: deployedLanderModel.get("lander_id"),
        //       domain_id: deployedDomainModel.get("domain_id"),
        //       group_id: group_id,
        //       deploy_status: "deploying"
        //     };
        //     var jobModel = new JobModel(jobAttributes);

        //     deployedLanderModelActiveJobs.add(jobModel);

        //     deployedDomainModelActiveJobs.add(jobModel);

        //     Landerds.trigger("job:start", jobModel);

        //   });

        //   if (domainListCollection.length <= 0) {
        //     deployedLanderModel.set("deploy_status", "deployed");
        //   }

        //   deployedLanders.add(deployedLanderModel);

        // },


        addGroups: function(model) {
          this.addRow(model);
          this.expandAndShowRow(model);
        }

        
      }, BaseListController);
    });

    return Landerds.GroupsApp.Groups.List.Controller;
  });
