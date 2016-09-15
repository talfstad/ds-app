define(["app",
    "tpl!assets/js/apps/landerds/groups/list/templates/groups_list_row.tpl",
    "assets/js/apps/landerds/groups/list/deployed_landers/views/deployed_landers_collection_view",
    "assets/js/apps/landerds/groups/list/deployed_landers/views/deployed_landers_empty_view",
    "assets/js/apps/landerds/groups/dao/sidebar_model",
    "assets/js/apps/landerds/groups/list/views/lander_tab_handle_view",
    "assets/js/apps/landerds/groups/list/views/domain_tab_handle_view",
    "assets/js/apps/landerds/groups/list/domains/views/domains_collection_view",
    "assets/js/common/notification",
    "assets/js/apps/landerds/base_classes/list/views/list_rows_base_view",
    "bootstrap",
  ],
  function(Landerds, LandersListItemTpl, DeployedListChildView, DeployedListEmptyView, SidebarModel,
    DeployStatusView, DomainTabHandleView, ActiveGroupsView, Notification, ListRowsBaseView) {

    Landerds.module("GroupsApp.Groups.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.childView = ListRowsBaseView.extend({

        initialize: function() {
          ListRowsBaseView.prototype.initialize.apply(this);
        },

        className: "bs-component accordion-group",

        template: LandersListItemTpl,
        childView: DeployedListChildView,
        emptyView: DeployedListEmptyView,
        childViewContainer: "table.deployed-groups-region",

        modelEvents: {
          "notifySuccessDeleteGroups": "notifySuccessDeleteGroups",
          "notifySuccessChangeGroupsName": "notifySuccessChangeGroupsName",
          "notifyErrorDeleteGroups": "notifyErrorDeleteGroups",
          "resortAndExpandModelView": "renderAndShowThisViewsPage",
          "change:deploy_status": "alertDeployStatus"
        },

        regions: {
          'lander_tab_handle_region': '.lander-tab-handle-region',
          'deployed_landers_region': '.deployed-landers-region',
          'domain_tab_handle_region': '.domain-tab-handle-region',
          'domains_region': '.domains-region',
          'deploy_to_new_domain_region': '.deploy-to-new-domain-region',
        },

        alertDeployStatus: function() {
          //show correct one
          var deployStatus = this.model.get("deploy_status");

          if (deployStatus === "deleting") {
            this.$el.find(".deploy-status-text").text("Deleting");
            this.$el.find(".alert-working-badge").show();
          } else {
            this.$el.find(".deploy-status-text").text("Working");

            if (deployStatus !== "deployed" && deployStatus !== "not_deployed") {
              this.$el.find(".alert-working-badge").show();
            } else {
              this.$el.find(".alert-working-badge").hide();
            }
          }
        },

        onBeforeRender: function() {
          ListRowsBaseView.prototype.onBeforeRender.apply(this);
        },

        notifySuccessDeleteGroups: function() {
          Notification(this.model.get("name"), "Successfully Deleted", "success", "stack_top_right");
        },

        notifySuccessChangeGroupsName: function() {
          Notification(this.model.get("name"), "Successfully Changed Name", "success", "stack_top_right");
        },

        notifyErrorDeleteGroups: function(errorMsg) {
          // Notification(this.model.get("domain"), errorMsg, "danger", "stack_top_right");
          // this.model.trigger("reset");
        },


        onRender: function() {

          var me = this;

          this.alertDeployStatus();

          this.reAlignTableHeader();

          //if deleting need to show delet state (which is disabling the whole thing)
          if (this.model.get("deploy_status") === "deleting") {
            this.disableAccordionPermanently();
          } else {

            //add/remove hovering attribute so we can correctly animate closing of the right sidebar
            this.$el.find(".accordion-toggle").hover(function(e) {
                $(e.currentTarget).attr("data-currently-hovering", true);
              },
              function(e) {
                $(e.currentTarget).attr("data-currently-hovering", false);
              });

            this.$el.find(".domain-tab-handle-region").hover(function(e) {
              $(e.currentTarget).attr("data-currently-hovering", true);
            }, function(e) {
              $(e.currentTarget).attr("data-currently-hovering", false);
            });

            this.$el.find(".lander-tab-handle-region").hover(function(e) {
              $(e.currentTarget).attr("data-currently-hovering", true);
            }, function(e) {
              $(e.currentTarget).attr("data-currently-hovering", false);
            });

            this.$el.on('hide.bs.collapse', function(e) {

              me.trigger('childCollapsed');

              //close right sidebar if closing all domain accordions
              if ($(e.currentTarget).find("a[data-currently-hovering='true']").length > 0) {
                Landerds.trigger('groups:closesidebar');
              }

              $(e.currentTarget).find("li.active").removeClass("active");
              $(e.currentTarget).find(".accordion-toggle").removeClass('active');
              $(e.currentTarget).find(".add-link-plus").hide();
            });

            this.$el.on('show.bs.collapse', function(e) {
              me.reAlignTableHeader();

              me.trigger('childExpanded');

              //collapse ALL others so we get an accordian effect !IMPORTANT for design
              $("#list-collection .collapse").collapse("hide");

              //disable the controls until shown (fixes multiple showing bug if clicked too fast)
              $(".accordion-toggle").addClass("inactive-link");

              //first dont show any tabs then show correct tab
              $(e.currentTarget).find("li.lander-tab-handle-region").removeClass("active");
              $(e.currentTarget).find("div[id^='landers-tab']").removeClass("active");
              $(e.currentTarget).find("li.domain-tab-handle-region").removeClass("active");
              $(e.currentTarget).find("div[id^='domains-tab']").removeClass("active");
              //show the correct tab
              var currentTab = $(e.currentTarget).find("li[data-currently-hovering='true']");
              var currentTabData = $("#" + currentTab.attr("data-tab-target"));
              if (currentTab.length > 0) {
                //show clicked on tab
                currentTab.addClass("active");
                currentTabData.addClass("active");
                currentTab.find(".add-link-plus").css("display", "inline");
              } else {
                //no tab show landers tab
                var tabHandle = $(e.currentTarget).find("li.lander-tab-handle-region");
                tabHandle.addClass("active");
                tabHandle.find(".add-link-plus").css("display", "inline");

                var tab = $(e.currentTarget).find("div[id^='landers-tab']");
                tab.addClass("active");

                me.reAlignTableHeader();
              }

              $(e.currentTarget).find(".accordion-toggle").addClass('active')

              $(e.currentTarget).parent().find(".panel").addClass(".panel-info");

              Landerds.trigger('groups:opensidebar', me.model);

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
    return Landerds.GroupsApp.Groups.List.childView;
  });
