define(["app",
    "tpl!assets/js/apps/landerds/landers/list/templates/landers_list_row.tpl",
    "assets/js/apps/landerds/landers/list/deployed_domains/views/deployed_domains_collection_view",
    "assets/js/apps/landerds/landers/list/deployed_domains/views/deployed_domains_empty_view",
    "assets/js/apps/landerds/landers/dao/sidebar_model",
    "assets/js/apps/landerds/landers/list/views/domain_tab_handle_view",
    "assets/js/apps/landerds/landers/list/views/group_tab_handle_view",
    "assets/js/apps/landerds/landers/list/active_groups/views/active_groups_collection_view",
    "assets/js/apps/landerds/landers/list/deployed_domains/views/deployed_domains_collection_view",
    "assets/js/apps/landerds/base_classes/list/views/list_rows_base_view",
    "summernote",
    "bootstrap",
  ],
  function(Landerds, LandersListItemTpl, DeployedListChildView, DeployedListEmptyView, SidebarModel,
    DeployStatusView, GroupsTabHandleView, ActiveGroupsView, DeployedDomainsView, ListRowsBaseView) {

    Landerds.module("LandersApp.Landers.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.childView = ListRowsBaseView.extend({

        initialize: function() {
          ListRowsBaseView.prototype.initialize.apply(this);
        },

        className: "bs-component accordion-group",

        template: LandersListItemTpl,
        childView: DeployedListChildView,
        emptyView: DeployedListEmptyView,
        childViewContainer: "table.deployed-domains-region",

        regions: {
          'deploy_status_region': '.deploy-status-region',
          'deployed_domains_region': '.deployed-domains-region',
          'group_tab_handle_region': '.group-tab-handle-region',
          'active_groups_region': '.active-groups-region'
        },

        events: {
          "click button.deploy-to-domain": "showDeployLanderToDomain",
          "click button.add-to-group": "showAddToGroup",
          "blur .editable-lander-name": "saveEditedLanderName",
          "click .editable-lander-name": "stopPropagationIfReadonly",
          "keydown .editable-lander-name": "updateNameInputWidth"
        },

        modelEvents: {
          "change:deploy_status": "alertDeployStatus",
          "change:modified": "updateModifiedInGui",
          "resortAndExpandModelView": "renderAndShowThisViewsPage",
          "landerFinishAdded": "renderAndShowThisViewsPage",
          "setNotesInEditor": "setNotesInEditor",
          "change:name": "updateNameInGui",
          "saveEditedLanderName": "saveEditedLanderName",
          "updateNameInputWidth": "updateNameInputWidth",
        },

        updateNameInGui: function() {
          var nameInputEl = this.$el.find("input.editable-lander-name");
          var isAlreadyUpdated = (nameInputEl.val() == this.model.get("name"));
          if (!isAlreadyUpdated) {
            var newLanderName = this.model.get("name");
            nameInputEl.val(newLanderName);
            this.updateInputWidth();
          }
        },

        updateModifiedInGui: function() {
          if ($("#filter-modified-checkbox").is(":checked")) {
            this.renderAndShowThisViewsPage();
          } else {
            var modifiedEl = this.$el.find(".modified-circle");
            if (this.model.get("modified")) {
              modifiedEl.css("display", "inline-block");
            } else {
              modifiedEl.hide();
            }
          }
        },

        showCancelLander: function(e) {
          //only called when there is an active add job and there is only 1 job
          if (e) e.preventDefault();
          var activeJobs = this.model.get("activeJobs");
          var addJob = activeJobs.first();
          if (addJob) {
            var addJobAction = addJob.get("action");
            if (addJobAction == "ripLander") {
              Landerds.trigger("landers:cancelRipLander", this.model);
            } else if (addJobAction == "addLander") {
              Landerds.trigger("landers:cancelAddLander", this.model);
            }
          }
        },

        updateNameInputWidth: function(e) {
          var me = this;
          if (e) {
            if (e.keyCode == 13) {
              me.saveEditedLanderName(e);
            }
          }
          this.updateInputWidth(e);
        },

        saveEditedLanderName: function(e) {
          if (e) e.preventDefault();
          var me = this;

          var newLanderName = $(e.currentTarget).val();

          if (newLanderName != "" && newLanderName != this.model.get("name") && /.*[a-zA-Z0-9]+.*/.test(newLanderName)) {
            this.trigger("saveLanderName", newLanderName, e);
          } else {
            $(e.currentTarget).val(this.model.get("name"));
            this.updateInputWidth();
          }
        },

        alertDeployStatus: function() {
          var me = this;
          //show correct one
          var deployStatus = this.model.get("deploy_status");
          var rootDeployStatus = deployStatus.split(":")[0];

          deploy_status_gui = "Working";

          //handles deployed rows AND lander deploy status
          if (deployStatus !== "deployed" && deployStatus !== "not_deployed" && deployStatus !== "saving") {
            this.$el.find(".alert-working-badge").show();
          } else {
            this.$el.find(".alert-working-badge").hide();
          }

          if (deployStatus == "deleting") {
            this.$el.find(".alert-working-badge").hide();
            this.$el.find(".alert-deleting-badge").show();
            Landerds.trigger('landers:closesidebar');
            this.disableAccordionPermanently();
          }

          //rip and add deploy status'
          if (rootDeployStatus == "initializing") {

            if (deployStatus == "initializing:rip") {
              //change the gui working from working to something else
              deploy_status_gui = "Rip Initializing";
            } else if (deployStatus == "initializing:rip_optimizing") {
              deploy_status_gui = "Rip Optimizing";
            } else if (deployStatus == "initializing:rip_finishing") {
              deploy_status_gui = "Rip Finishing";
            }

            if (deployStatus == "initializing:add") {
              //change the gui working from working to something else
              deploy_status_gui = "Initializing";
            } else if (deployStatus == "initializing:add_optimizing") {
              deploy_status_gui = "Optimizing";
            } else if (deployStatus == "initializing:add_finishing") {
              deploy_status_gui = "Lander Finishing";
            }

            var rowDeployStatusEl = this.$el.find(".row-deploy-status-button");
            rowDeployStatusEl.addClass("add-lander");
            rowDeployStatusEl.off("click");
            rowDeployStatusEl.on("click", function(e) {
              //check if click in button retangle to cancel
              me.showCancelLander();
            });
          }

          this.model.set("deploy_status_gui", deploy_status_gui);

          //update the text without a render
          this.$el.find(".deploy-status-gui").text(deploy_status_gui);
        },

        showDeployLanderToDomain: function() {
          Landerds.trigger("landers:showDeployToDomain", this.model);
        },

        showAddToGroup: function() {
          Landerds.trigger("landers:showAddToGroup", this.model);
        },

        onBeforeRender: function() {
          ListRowsBaseView.prototype.onBeforeRender.apply(this);
        },

        onDomRefresh: function() {
          this.updateInputWidth();
        },

        onRender: function() {

          var me = this;

          this.alertDeployStatus();
          this.reAlignTableHeader();

          this.$el.find(".row-deploy-status-button.add-lander").hover(function(e) {
              var currentTarget = $(e.currentTarget);
              currentTarget.find(".glyphicon").removeClass("glyphicon-refresh").removeClass("glyphicon-refresh-animate").addClass("glyphicon-remove-sign").addClass("text-danger");
              me.$el.find(".list-row-item").css("cursor", "pointer");
            },
            function(e) {
              var currentTarget = $(e.currentTarget);
              currentTarget.find(".glyphicon").removeClass("glyphicon-remove-sign").addClass("glyphicon-refresh").addClass("glyphicon-refresh-animate").removeClass("text-danger");
              me.$el.find(".list-row-item").css("cursor", "not-allowed");
            });

          //if deleting need to show delete state (which is disabling the whole thing)
          var deployStatus = this.model.get("deploy_status");
          var rootDeployStatus = deployStatus.split(":")[0];
          if (rootDeployStatus === "deleting" || rootDeployStatus == "initializing") {
            this.disableAccordionPermanently();
          } else {

            var onHoverTabsHighlightRow = function(e, highlight) {
              var currentTarget = $(e.currentTarget);
              if (highlight) {
                // currentTarget.parent().find("li a").css("color","#222")
                currentTarget.parent().parent().find("div.list-row-item").css("color", "#222");
              } else {
                // currentTarget.parent().find("li a").css("color","")
                currentTarget.parent().parent().find("div.list-row-item").css("color", "");
              }
            };

            //add/remove hovering attribute so we can correctly animate closing of the right sidebar
            this.$el.find(".accordion-toggle").hover(function(e) {
                //add hover attributes to row tabs
                var currentTarget = $(e.currentTarget);
                currentTarget.parent().find("ul.nav.panel-tabs > li > a:last").css("color", "#222");
                currentTarget.attr("data-currently-hovering", true);
              },
              function(e) {
                var currentTarget = $(e.currentTarget);
                currentTarget.parent().find("ul.nav.panel-tabs > li > a:last").css("color", "");
                currentTarget.attr("data-currently-hovering", false);
              });

            this.$el.find(".group-tab-handle-region").hover(function(e) {
              onHoverTabsHighlightRow(e, true);
              var currentTarget = $(e.currentTarget);
              currentTarget.attr("data-currently-hovering", true);
            }, function(e) {
              onHoverTabsHighlightRow(e, false);
              $(e.currentTarget).attr("data-currently-hovering", false);
            });

            this.$el.find(".deploy-status-region").hover(function(e) {
              onHoverTabsHighlightRow(e, true);
              $(e.currentTarget).attr("data-currently-hovering", true);
            }, function(e) {
              onHoverTabsHighlightRow(e, false);
              $(e.currentTarget).attr("data-currently-hovering", false);
            });

            this.$el.find(".notes-tab-handle-region").hover(function(e) {
              onHoverTabsHighlightRow(e, true);
              $(e.currentTarget).attr("data-currently-hovering", true);
            }, function(e) {
              onHoverTabsHighlightRow(e, false);
              $(e.currentTarget).attr("data-currently-hovering", false);
            });

            this.$el.on('hide.bs.collapse', function(e) {

              me.trigger('childCollapsed');

              me.destroySummernoteEditor();

              //allow input to be editable
              me.$el.find(".editable-lander-name").attr('readonly', '');

              //close right sidebar if closing all domain accordions
              if ($(e.currentTarget).find("div[data-currently-hovering='true']").length > 0) {
                Landerds.trigger('landers:closesidebar');
              }

              $(e.currentTarget).find("li.active").removeClass("active");
              $(e.currentTarget).find(".accordion-toggle").removeClass('active');
              $(e.currentTarget).find(".add-link-plus").hide();
            });

            this.$el.on('show.bs.collapse', function(e) {
              me.trigger('childExpanded');

              me.reAlignTableHeader();
              me.initSummernoteEditor();

              //dont allow lander name to be edited
              me.$el.find(".editable-lander-name").removeAttr('readonly');

              //collapse ALL others so we get an accordian effect !IMPORTANT for design
              $("#list-collection .collapse").collapse("hide");

              //disable the controls until shown (fixes multiple showing bug if clicked too fast)
              $(".accordion-toggle").addClass("inactive-link");

              //first dont show any tabs then show correct tab
              $(e.currentTarget).find("li.deploy-status-region").removeClass("active");
              $(e.currentTarget).find("div[id^='domains-tab']").removeClass("active");
              $(e.currentTarget).find("li.group-tab-handle-region").removeClass("active");
              $(e.currentTarget).find("div[id^='groups-tab']").removeClass("active");
              $(e.currentTarget).find("li.notes-tab-handle-region").removeClass("active");
              $(e.currentTarget).find("div[id^='notes-tab']").removeClass("active");
              //show the correct tab
              var currentTab = $(e.currentTarget).find("li[data-currently-hovering='true']");
              var currentTabData = $("#" + currentTab.attr("data-tab-target"));
              if (currentTab.length > 0) {
                //show clicked on tab
                currentTab.addClass("active");
                currentTabData.addClass("active");
                currentTab.find(".add-link-plus").css("display", "inline");
                currentTab.find("a[href^='#notes-tab']").trigger("show.bs.tab") //trigger the show event
              } else {
                //no tab show domains tab
                var tabHandle = $(e.currentTarget).find("li.deploy-status-region");

                tabHandle.addClass("active");
                $(e.currentTarget).find("div[id^='domains-tab']").addClass("active");
                tabHandle.find(".add-link-plus").css("display", "inline");
              }

              $(e.currentTarget).find(".accordion-toggle").addClass('active');

              $(e.currentTarget).parent().find(".panel").addClass(".panel-info");

              Landerds.trigger('landers:opensidebar', me.model);

            });

            this.$el.on('shown.bs.collapse', function(e) {
              //enable the anchor tags
              $(".accordion-toggle").removeClass("inactive-link");
            });

            this.$el.find(".nav.panel-tabs").click(function(e) {
              me.reAlignTableHeader();
              $(e.currentTarget).parent().parent().find(".panel-collapse").collapse('show');
            });
          }
        }
      });
    });
    return Landerds.LandersApp.Landers.List.childView;
  });
